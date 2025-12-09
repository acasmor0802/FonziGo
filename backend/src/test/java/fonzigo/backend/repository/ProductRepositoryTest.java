package fonzigo.backend.repository;

import fonzigo.backend.entity.Product;
import fonzigo.backend.entity.Category;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class ProductRepositoryTest {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void testCountAllProducts() {
        // Arrange
        Category category = new Category();
        category.setName("Test Category " + System.currentTimeMillis());
        category = categoryRepository.save(category);

        Product product1 = new Product();
        product1.setName("Product 1 " + System.currentTimeMillis());
        product1.setStock(10);
        product1.setCategory(category);
        productRepository.save(product1);

        Product product2 = new Product();
        product2.setName("Product 2 " + System.currentTimeMillis());
        product2.setStock(20);
        product2.setCategory(category);
        productRepository.save(product2);

        // Act
        long count = productRepository.countAllProducts();

        // Assert
        assertThat(count).isGreaterThanOrEqualTo(2);
    }

    @Test
    void testAverageStock() {
        // Act
        Double avgStock = productRepository.averageStock();

        // Assert
        assertThat(avgStock).isNotNull();
    }

    @Test
    void testTotalStock() {
        // Act
        Long totalStock = productRepository.totalStock();

        // Assert
        assertThat(totalStock).isNotNull();
    }

    @Test
    void testFindByNameContainingIgnoreCase() {
        // Arrange
        String uniqueName = "UniqueTestProduct" + System.currentTimeMillis();
        Category category = new Category();
        category.setName("Test Category " + System.currentTimeMillis());
        category = categoryRepository.save(category);

        Product product = new Product();
        product.setName(uniqueName);
        product.setStock(10);
        product.setCategory(category);
        productRepository.save(product);

        // Act
        var results = productRepository.findByNameContainingIgnoreCase(uniqueName.substring(0, 10));

        // Assert
        assertThat(results).isNotEmpty();
        assertThat(results).anyMatch(p -> p.getName().equals(uniqueName));
    }
}
