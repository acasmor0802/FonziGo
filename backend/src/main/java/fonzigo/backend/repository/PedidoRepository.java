
package fonzigo.backend.repository;

import fonzigo.backend.entity.Pedido;
import fonzigo.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUser(Usuario user);
    
    @Query("SELECT COUNT(p) FROM Pedido p WHERE p.user = :user")
    long countOrdersByUser(@Param("user") Usuario user);
}
