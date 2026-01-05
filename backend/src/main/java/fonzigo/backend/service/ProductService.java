
package fonzigo.backend.service;

import fonzigo.backend.dto.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProductService {
    List<ProductDTO> getAllProducts();
    Page<ProductDTO> getAllProducts(Pageable pageable);
    Page<ProductDTO> getProductsByCategory(Long categoryId, Pageable pageable);
    Page<ProductDTO> getProductsBySupermarket(Long supermarketId, Pageable pageable);
    Page<ProductDTO> searchProducts(String query, Pageable pageable);
    Page<ProductDTO> searchProductsByCategory(String query, Long categoryId, Pageable pageable);
    
    // Métodos para ofertas
    Page<ProductDTO> getProductsOnSale(Pageable pageable);
    Page<ProductDTO> getProductsOnSaleByCategory(Long categoryId, Pageable pageable);
    Page<ProductDTO> searchProductsOnSale(String query, Pageable pageable);
    Page<ProductDTO> searchProductsOnSaleByCategory(String query, Long categoryId, Pageable pageable);
    
    ProductDTO getProductById(Long id);
    ProductDTO createProduct(ProductDTO productDTO);
    ProductDTO updateProduct(Long id, ProductDTO productDTO);
    void deleteProduct(Long id);
    ProductDTO updateProductImage(Long id, String imageUrl);
}
