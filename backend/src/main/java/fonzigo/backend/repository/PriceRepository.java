
package fonzigo.backend.repository;

import fonzigo.backend.entity.Price;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import fonzigo.backend.entity.Product;
import fonzigo.backend.entity.Supermarket;

@Repository
public interface PriceRepository extends JpaRepository<Price, Long> {
    List<Price> findByProduct(Product product);
    List<Price> findBySupermarket(Supermarket supermarket);
    Optional<Price> findByProductAndSupermarket(Product product, Supermarket supermarket);
    List<Price> findBySupermarketAndOnSaleTrue(Supermarket supermarket);
}
