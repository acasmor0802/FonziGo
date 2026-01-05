package fonzigo.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/images")
@Tag(name = "Images", description = "Servir imágenes de productos y recursos")
public class ImageController {

    @Value("${file.upload.dir:uploads/}")
    private String uploadDir;

    @GetMapping("/products/{filename}")
    @Operation(summary = "Obtener imagen de producto")
    public ResponseEntity<Resource> getProductImage(@PathVariable String filename) {
        return serveImage("products/" + filename);
    }

    @GetMapping("/supermarkets/{filename}")
    @Operation(summary = "Obtener imagen de supermercado")
    public ResponseEntity<Resource> getSupermarketImage(@PathVariable String filename) {
        return serveImage("supermarkets/" + filename);
    }

    @GetMapping("/users/{filename}")
    @Operation(summary = "Obtener imagen de usuario")
    public ResponseEntity<Resource> getUserImage(@PathVariable String filename) {
        return serveImage("users/" + filename);
    }

    private ResponseEntity<Resource> serveImage(String relativePath) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(relativePath).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
