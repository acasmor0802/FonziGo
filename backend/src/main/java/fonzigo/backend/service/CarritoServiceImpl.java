
package fonzigo.backend.service;

import fonzigo.backend.dto.CarritoDTO;
import fonzigo.backend.dto.ElementoCarritoDTO;
import fonzigo.backend.entity.*;
import fonzigo.backend.repository.*;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarritoServiceImpl implements CarritoService {

    private final CarritoRepository carritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductRepository productRepository;
    private final ElementoCarritoRepository elementoCarritoRepository;

    public CarritoServiceImpl(CarritoRepository carritoRepository, UsuarioRepository usuarioRepository, ProductRepository productRepository, ElementoCarritoRepository elementoCarritoRepository) {
        this.carritoRepository = carritoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productRepository = productRepository;
        this.elementoCarritoRepository = elementoCarritoRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public CarritoDTO getCartByUserId(Long userId) {
        Usuario user = usuarioRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Carrito cart = getOrCreateCartForUser(user);
        return convertToDto(cart);
    }

    @Override
    @Transactional
    public CarritoDTO addProductToCart(Long userId, Long productId, int quantity) {
        Usuario user = usuarioRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        Carrito cart = getOrCreateCartForUser(user);

        if (product.getStock() < quantity) {
            throw new RuntimeException("Not enough stock for product: " + product.getName());
        }

        Optional<ElementoCarrito> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            ElementoCarrito item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            elementoCarritoRepository.save(item);
        } else {
            ElementoCarrito newItem = new ElementoCarrito();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getItems().add(elementoCarritoRepository.save(newItem));
        }

        return convertToDto(cart);
    }



    @Override
    @Transactional
    public CarritoDTO removeProductFromCart(Long cartItemId) {
        ElementoCarrito item = elementoCarritoRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        Carrito cart = item.getCart();
        elementoCarritoRepository.delete(item);
        // We need to refresh the cart entity from the database to get the updated item list
        carritoRepository.flush(); 
        Carrito updatedCart = carritoRepository.findById(cart.getId()).get();
        return convertToDto(updatedCart);
    }

    private Carrito getOrCreateCartForUser(Usuario user) {
        return carritoRepository.findByUser(user)
                .orElseGet(() -> {
                    Carrito newCart = new Carrito();
                    newCart.setUser(user);
                    return carritoRepository.save(newCart);
                });
    }

    private CarritoDTO convertToDto(Carrito cart) {
        CarritoDTO dto = new CarritoDTO();
        dto.setId(cart.getId());
        dto.setUserId(cart.getUser().getId());
        if (cart.getItems() != null) {
            dto.setItems(cart.getItems().stream()
                    .map(this::convertItemToDto)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    private ElementoCarritoDTO convertItemToDto(ElementoCarrito item) {
        ElementoCarritoDTO dto = new ElementoCarritoDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setQuantity(item.getQuantity());
        return dto;
    }
}
