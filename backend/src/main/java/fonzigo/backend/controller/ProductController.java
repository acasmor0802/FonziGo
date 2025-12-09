package fonzigo.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import fonzigo.backend.dto.ProductDTO;
import fonzigo.backend.service.ProductService;
import fonzigo.backend.service.FileUploadService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "Gestión de productos")
public class ProductController {

    private final ProductService productService;
    private final FileUploadService fileUploadService;

    public ProductController(ProductService productService, FileUploadService fileUploadService) {
        this.productService = productService;
        this.fileUploadService = fileUploadService;
    }

    @GetMapping
    @Operation(summary = "Obtener todos los productos", description = "Retorna una lista paginada de productos. Usa ?page=0&size=10&sort=name,asc para paginación")
    public ResponseEntity<Page<ProductDTO>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ProductDTO> products = productService.getAllProducts(pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener producto por ID", description = "Retorna un producto específico por su ID")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Crear nuevo producto", description = "Solo administradores pueden crear productos")
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        ProductDTO createdProduct = productService.createProduct(productDTO);
        return ResponseEntity.status(201).body(createdProduct);
    }

    @PostMapping("/{id}/upload-image")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Subir imagen de producto", description = "Solo administradores pueden subir imágenes")
    public ResponseEntity<ProductDTO> uploadProductImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        
        String imageUrl = fileUploadService.uploadFile(file);
        ProductDTO updatedProduct = productService.updateProductImage(id, imageUrl);
        return ResponseEntity.ok(updatedProduct);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Actualizar producto", description = "Solo administradores pueden actualizar productos")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id, 
            @Valid @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar producto", description = "Solo administradores pueden eliminar productos")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
