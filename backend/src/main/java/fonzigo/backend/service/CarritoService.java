
package fonzigo.backend.service;

import fonzigo.backend.dto.CarritoDTO;

public interface CarritoService {
    CarritoDTO getCartByUserId(Long userId);
    CarritoDTO addProductToCart(Long userId, Long productId, int quantity);
    CarritoDTO removeProductFromCart(Long cartItemId);
}
