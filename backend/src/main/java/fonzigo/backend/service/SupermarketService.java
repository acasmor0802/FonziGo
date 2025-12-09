
package fonzigo.backend.service;

import fonzigo.backend.dto.SupermarketDTO;
import java.util.List;

public interface SupermarketService {
    List<SupermarketDTO> getAllSupermarkets();
    SupermarketDTO getSupermarketById(Long id);
    SupermarketDTO createSupermarket(SupermarketDTO supermarketDTO);
    SupermarketDTO updateSupermarket(Long id, SupermarketDTO supermarketDTO);
    void deleteSupermarket(Long id);
}
