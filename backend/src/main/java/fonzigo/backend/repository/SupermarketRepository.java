
package fonzigo.backend.repository;

import fonzigo.backend.entity.Supermarket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

@Repository
public interface SupermarketRepository extends JpaRepository<Supermarket, Long> {
    List<Supermarket> findByNameContainingIgnoreCase(String name);
}
