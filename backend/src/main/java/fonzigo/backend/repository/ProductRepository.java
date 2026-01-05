
package fonzigo.backend.repository;

import fonzigo.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String name);
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    Page<Product> findBySupermarketId(Long supermarketId, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCaseAndCategoryId(String name, Long categoryId, Pageable pageable);
    List<Product> findByStockGreaterThan(Integer stock);
    List<Product> findByCategoryIdAndIdNot(Long categoryId, Long productId);
    
    // Filtros para ofertas
    Page<Product> findByOnSaleTrue(Pageable pageable);
    Page<Product> findByOnSaleTrueAndCategoryId(Long categoryId, Pageable pageable);
    Page<Product> findByOnSaleTrueAndNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Product> findByOnSaleTrueAndNameContainingIgnoreCaseAndCategoryId(String name, Long categoryId, Pageable pageable);
    
    @Query("SELECT COUNT(p) FROM Product p")
    long countAllProducts();
    
    @Query("SELECT COALESCE(AVG(CAST(p.stock AS double)), 0.0) FROM Product p")
    Double averageStock();
    
    @Query("SELECT COALESCE(SUM(CAST(p.stock AS long)), 0L) FROM Product p")
    Long totalStock();
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.stock = 0")
    long countOutOfStock();
}
