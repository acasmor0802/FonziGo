
package fonzigo.backend.service;

import fonzigo.backend.dto.CarritoDTO;
import fonzigo.backend.dto.ElementoCarritoDTO;
import fonzigo.backend.entity.*;
import fonzigo.backend.exception.ResourceNotFoundException;
import fonzigo.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementación del servicio de carrito de compras.
 * Gestiona operaciones CRUD del carrito y sus elementos.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CarritoServiceImpl implements CarritoService {

    private final CarritoRepository carritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductRepository productRepository;
    private final ElementoCarritoRepository elementoCarritoRepository;

    @Override
    @Transactional
    public CarritoDTO getCartByUserId(Long userId) {
        log.debug("Obteniendo carrito del usuario ID: {}", userId);
        Usuario user = findUserById(userId);
        Carrito cart = getOrCreateCartForUser(user);
        return convertToDto(cart);
    }

    @Override
    @Transactional
    public CarritoDTO addProductToCart(Long userId, Long productId, int quantity) {
        log.info("Añadiendo producto {} al carrito del usuario {}", productId, userId);
        Usuario user = findUserById(userId);
        Product product = findProductById(productId);
        Carrito cart = getOrCreateCartForUser(user);

        validateStock(product, quantity);

        cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .ifPresentOrElse(
                        existingItem -> {
                            existingItem.setQuantity(existingItem.getQuantity() + quantity);
                            elementoCarritoRepository.save(existingItem);
                        },
                        () -> addNewItemToCart(cart, product, quantity)
                );

        return convertToDto(cart);
    }

    @Override
    @Transactional
    public CarritoDTO updateCartItemQuantity(Long userId, Long cartItemId, int quantity) {
        log.info("Actualizando cantidad del item {} para usuario {}", cartItemId, userId);
        ElementoCarrito item = findCartItemById(cartItemId);
        validateCartItemOwnership(item, userId);
        
        if (quantity <= 0) {
            return removeProductFromCart(userId, cartItemId);
        }
        
        item.setQuantity(quantity);
        elementoCarritoRepository.save(item);
        return convertToDto(item.getCart());
    }

    @Override
    @Transactional
    public CarritoDTO removeProductFromCart(Long userId, Long cartItemId) {
        log.info("Eliminando item {} del carrito del usuario {}", cartItemId, userId);
        ElementoCarrito item = findCartItemById(cartItemId);
        validateCartItemOwnership(item, userId);
        
        Carrito cart = item.getCart();
        elementoCarritoRepository.delete(item);
        carritoRepository.flush(); 
        
        return carritoRepository.findById(cart.getId())
                .map(this::convertToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito no encontrado"));
    }

    @Override
    @Transactional
    public CarritoDTO clearCart(Long userId) {
        log.info("Vaciando carrito del usuario {}", userId);
        Usuario user = findUserById(userId);
        Carrito cart = getOrCreateCartForUser(user);
        
        elementoCarritoRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
        carritoRepository.save(cart);
        
        return convertToDto(cart);
    }

    // ==================== Helper Methods ====================

    private Usuario findUserById(Long userId) {
        return usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + userId));
    }

    private Product findProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + productId));
    }

    private ElementoCarrito findCartItemById(Long cartItemId) {
        return elementoCarritoRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Elemento del carrito no encontrado con ID: " + cartItemId));
    }

    private void validateStock(Product product, int quantity) {
        Optional.ofNullable(product.getStock())
                .filter(stock -> stock < quantity)
                .ifPresent(stock -> {
                    throw new IllegalStateException("Stock insuficiente para producto: " + product.getName());
                });
    }

    private void validateCartItemOwnership(ElementoCarrito item, Long userId) {
        if (!item.getCart().getUser().getId().equals(userId)) {
            throw new IllegalStateException("El elemento del carrito no pertenece al usuario");
        }
    }

    private void addNewItemToCart(Carrito cart, Product product, int quantity) {
        ElementoCarrito newItem = new ElementoCarrito();
        newItem.setCart(cart);
        newItem.setProduct(product);
        newItem.setQuantity(quantity);
        cart.getItems().add(elementoCarritoRepository.save(newItem));
    }

    private Carrito getOrCreateCartForUser(Usuario user) {
        return carritoRepository.findByUser(user)
                .orElseGet(() -> {
                    Carrito newCart = new Carrito();
                    newCart.setUser(user);
                    newCart.setItems(new ArrayList<>());
                    return carritoRepository.save(newCart);
                });
    }

    // ==================== DTO Conversion ====================

    private CarritoDTO convertToDto(Carrito cart) {
        CarritoDTO dto = new CarritoDTO();
        dto.setId(cart.getId());
        dto.setUserId(cart.getUser().getId());
        
        Optional.ofNullable(cart.getItems()).ifPresent(items -> {
            dto.setItems(items.stream()
                    .map(this::convertItemToDto)
                    .collect(Collectors.toList()));
            
            BigDecimal subtotal = items.stream()
                    .filter(item -> item.getProduct().getPrice() != null)
                    .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            dto.setSubtotal(subtotal);
            dto.setItemCount(items.stream().mapToInt(ElementoCarrito::getQuantity).sum());
        });
        
        return dto;
    }

    private ElementoCarritoDTO convertItemToDto(ElementoCarrito item) {
        ElementoCarritoDTO dto = new ElementoCarritoDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductImage(item.getProduct().getImageUrl());
        dto.setPrice(item.getProduct().getPrice());
        dto.setOriginalPrice(item.getProduct().getOriginalPrice());
        dto.setUnit(item.getProduct().getUnit());
        dto.setQuantity(item.getQuantity());
        
        Optional.ofNullable(item.getProduct().getSupermarket())
                .map(Supermarket::getName)
                .ifPresent(dto::setSupermarketName);
        
        return dto;
    }
}
