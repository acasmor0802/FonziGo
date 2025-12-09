
package fonzigo.backend.repository;

import fonzigo.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByStockGreaterThan(Integer stock);
    
    @Query("SELECT COUNT(p) FROM Product p")
    long countAllProducts();
    
    @Query("SELECT COALESCE(AVG(CAST(p.stock AS double)), 0.0) FROM Product p")
    Double averageStock();
    
    @Query("SELECT COALESCE(SUM(CAST(p.stock AS long)), 0L) FROM Product p")
    Long totalStock();
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.stock = 0")
    long countOutOfStock();
}
