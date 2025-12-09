
package fonzigo.backend.service;

import fonzigo.backend.dto.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProductService {
    List<ProductDTO> getAllProducts();
    Page<ProductDTO> getAllProducts(Pageable pageable);
    ProductDTO getProductById(Long id);
    ProductDTO createProduct(ProductDTO productDTO);
    ProductDTO updateProduct(Long id, ProductDTO productDTO);
    void deleteProduct(Long id);
    ProductDTO updateProductImage(Long id, String imageUrl);
}
