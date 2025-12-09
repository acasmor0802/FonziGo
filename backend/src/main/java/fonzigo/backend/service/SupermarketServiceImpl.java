
package fonzigo.backend.service;

import fonzigo.backend.dto.SupermarketDTO;
import fonzigo.backend.entity.Supermarket;
import fonzigo.backend.repository.SupermarketRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupermarketServiceImpl implements SupermarketService {

    private final SupermarketRepository supermarketRepository;

    public SupermarketServiceImpl(SupermarketRepository supermarketRepository) {
        this.supermarketRepository = supermarketRepository;
    }

    @Override
    public List<SupermarketDTO> getAllSupermarkets() {
        return supermarketRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public SupermarketDTO getSupermarketById(Long id) {
        Supermarket supermarket = supermarketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supermarket not found"));
        return convertToDto(supermarket);
    }

    @Override
    public SupermarketDTO createSupermarket(SupermarketDTO supermarketDTO) {
        Supermarket supermarket = convertToEntity(supermarketDTO);
        Supermarket savedSupermarket = supermarketRepository.save(supermarket);
        return convertToDto(savedSupermarket);
    }

    @Override
    public SupermarketDTO updateSupermarket(Long id, SupermarketDTO supermarketDTO) {
        Supermarket supermarket = supermarketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supermarket not found"));
        BeanUtils.copyProperties(supermarketDTO, supermarket, "id");
        Supermarket updatedSupermarket = supermarketRepository.save(supermarket);
        return convertToDto(updatedSupermarket);
    }

    @Override
    public void deleteSupermarket(Long id) {
        supermarketRepository.deleteById(id);
    }

    private SupermarketDTO convertToDto(Supermarket supermarket) {
        SupermarketDTO supermarketDTO = new SupermarketDTO();
        BeanUtils.copyProperties(supermarket, supermarketDTO);
        return supermarketDTO;
    }

    private Supermarket convertToEntity(SupermarketDTO supermarketDTO) {
        Supermarket supermarket = new Supermarket();
        BeanUtils.copyProperties(supermarketDTO, supermarket);
        return supermarket;
    }
}
