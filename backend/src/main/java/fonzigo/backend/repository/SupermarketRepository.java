
package fonzigo.backend.repository;

import fonzigo.backend.entity.Supermarket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupermarketRepository extends JpaRepository<Supermarket, Long> {
    List<Supermarket> findByNameContainingIgnoreCase(String name);
}
