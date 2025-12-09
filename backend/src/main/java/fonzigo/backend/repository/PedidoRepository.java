
package fonzigo.backend.repository;

import fonzigo.backend.entity.Pedido;
import fonzigo.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUser(Usuario user);
}
