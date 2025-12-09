
package fonzigo.backend.controller;

import fonzigo.backend.dto.SupermarketDTO;
import fonzigo.backend.service.SupermarketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supermarkets")
public class SupermarketController {

    private final SupermarketService supermarketService;

    public SupermarketController(SupermarketService supermarketService) {
        this.supermarketService = supermarketService;
    }

    @GetMapping
    public List<SupermarketDTO> getAllSupermarkets() {
        return supermarketService.getAllSupermarkets();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupermarketDTO> getSupermarketById(@PathVariable Long id) {
        SupermarketDTO supermarket = supermarketService.getSupermarketById(id);
        return ResponseEntity.ok(supermarket);
    }

    @PostMapping
    public ResponseEntity<SupermarketDTO> createSupermarket(@RequestBody SupermarketDTO supermarketDTO) {
        SupermarketDTO createdSupermarket = supermarketService.createSupermarket(supermarketDTO);
        return ResponseEntity.status(201).body(createdSupermarket);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupermarketDTO> updateSupermarket(@PathVariable Long id, @RequestBody SupermarketDTO supermarketDTO) {
        SupermarketDTO updatedSupermarket = supermarketService.updateSupermarket(id, supermarketDTO);
        return ResponseEntity.ok(updatedSupermarket);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupermarket(@PathVariable Long id) {
        supermarketService.deleteSupermarket(id);
        return ResponseEntity.noContent().build();
    }
}
