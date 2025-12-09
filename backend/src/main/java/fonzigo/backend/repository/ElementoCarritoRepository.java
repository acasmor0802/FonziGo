
package fonzigo.backend.repository;

import fonzigo.backend.entity.ElementoCarrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ElementoCarritoRepository extends JpaRepository<ElementoCarrito, Long> {
}
