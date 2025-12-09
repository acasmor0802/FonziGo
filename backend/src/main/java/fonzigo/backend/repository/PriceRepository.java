
package fonzigo.backend.repository;

import fonzigo.backend.entity.Price;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import fonzigo.backend.entity.Product;
import fonzigo.backend.entity.Supermarket;

@Repository
public interface PriceRepository extends JpaRepository<Price, Long> {
    List<Price> findByProduct(Product product);
    List<Price> findBySupermarket(Supermarket supermarket);
    Optional<Price> findByProductAndSupermarket(Product product, Supermarket supermarket);
    List<Price> findBySupermarketAndOnSaleTrue(Supermarket supermarket);
    
    @Query("SELECT AVG(p.price) FROM Price p WHERE p.product = :product")
    BigDecimal averagePriceByProduct(@Param("product") Product product);
    
    @Query("SELECT MIN(p.price) FROM Price p WHERE p.product = :product")
    BigDecimal minPriceByProduct(@Param("product") Product product);
    
    @Query("SELECT MAX(p.price) FROM Price p WHERE p.product = :product")
    BigDecimal maxPriceByProduct(@Param("product") Product product);
    
    @Query("SELECT COUNT(p) FROM Price p WHERE p.onSale = true")
    long countProductsOnSale();
}
