
package fonzigo.backend.service;

import fonzigo.backend.dto.PedidoDTO;
import fonzigo.backend.dto.LineaPedidoDTO;
import fonzigo.backend.entity.*;
import fonzigo.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CarritoRepository carritoRepository;
    private final ProductRepository productRepository;
    private final PriceRepository priceRepository;
    private final LineaPedidoRepository lineaPedidoRepository;


    public PedidoServiceImpl(PedidoRepository pedidoRepository, UsuarioRepository usuarioRepository, CarritoRepository carritoRepository, ProductRepository productRepository, PriceRepository priceRepository, LineaPedidoRepository lineaPedidoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.carritoRepository = carritoRepository;
        this.productRepository = productRepository;
        this.priceRepository = priceRepository;
        this.lineaPedidoRepository = lineaPedidoRepository;
    }

    @Override
    @Transactional
    public PedidoDTO createOrderFromCart(Long userId) {
        Usuario user = usuarioRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Carrito cart = carritoRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Cart not found for user"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot create order from an empty cart");
        }

        Pedido pedido = new Pedido();
        pedido.setUser(user);
        pedido.setOrderDate(LocalDateTime.now());
        pedido.setStatus("CREATED");
        
        List<LineaPedido> orderItems = new ArrayList<>();
        for (ElementoCarrito cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock for product: " + product.getName());
            }

            // For simplicity, we'll take the first price we find for a product.
            // A real app would need to know the supermarket context.
            Price price = priceRepository.findByProduct(product).stream().findFirst()
                    .orElseThrow(() -> new RuntimeException("Price not found for product: " + product.getName()));

            LineaPedido lineaPedido = new LineaPedido();
            lineaPedido.setOrder(pedido);
            lineaPedido.setProduct(product);
            lineaPedido.setQuantity(cartItem.getQuantity());
            lineaPedido.setPrice(price.getPrice()); // Price at time of purchase
            orderItems.add(lineaPedido);

            // Decrease stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        pedido.setOrderItems(orderItems);
        Pedido savedPedido = pedidoRepository.save(pedido);

        // Clear the cart
        cart.getItems().clear();
        carritoRepository.save(cart);

        return convertToDto(savedPedido);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoDTO> getOrdersForUser(Long userId) {
        Usuario user = usuarioRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return pedidoRepository.findByUser(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PedidoDTO getOrderById(Long orderId) {
        Pedido pedido = pedidoRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToDto(pedido);
    }

    private PedidoDTO convertToDto(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setId(pedido.getId());
        dto.setOrderDate(pedido.getOrderDate());
        dto.setStatus(pedido.getStatus());
        dto.setUserId(pedido.getUser().getId());
        dto.setOrderItems(pedido.getOrderItems().stream()
                .map(this::convertItemToDto)
                .collect(Collectors.toList()));
        return dto;
    }

    private LineaPedidoDTO convertItemToDto(LineaPedido item) {
        LineaPedidoDTO dto = new LineaPedidoDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setQuantity(item.getQuantity());
        dto.setPrice(item.getPrice());
        return dto;
    }
}
