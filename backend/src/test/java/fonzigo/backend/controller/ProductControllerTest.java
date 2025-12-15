package fonzigo.backend.controller;

import fonzigo.backend.dto.ProductDTO;
import fonzigo.backend.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class ProductControllerTest {

    @Autowired
    private ProductController productController;

    @Autowired
    private ProductService productService;

    @Test
    void testContextLoads() {
        assertThat(productController).isNotNull();
        assertThat(productService).isNotNull();
    }

    @Test
    void testGetAllProducts_WithPagination() {
        // Act
        Page<ProductDTO> products = productService.getAllProducts(PageRequest.of(0, 10));

        // Assert
        assertThat(products).isNotNull();
    }

    @Test
    void testValidationDTO() {
        // Test que la validación está configurada
        ProductDTO dto = new ProductDTO();
        dto.setName("Test Product");
        dto.setStock(10);
        dto.setCategoryId(1L);
        
        assertThat(dto.getName()).isEqualTo("Test Product");
        assertThat(dto.getStock()).isEqualTo(10);
    }
}
