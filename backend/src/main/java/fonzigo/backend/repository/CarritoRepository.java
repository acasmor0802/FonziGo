
package fonzigo.backend.repository;

import fonzigo.backend.entity.Carrito;
import fonzigo.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    Optional<Carrito> findByUser(Usuario user);
}
