
package fonzigo.backend.service;

import fonzigo.backend.dto.ProductDTO;
import fonzigo.backend.entity.Category;
import fonzigo.backend.entity.Product;
import fonzigo.backend.entity.Supermarket;
import fonzigo.backend.exception.ResourceNotFoundException;
import fonzigo.backend.repository.CategoryRepository;
import fonzigo.backend.repository.ProductRepository;
import fonzigo.backend.repository.SupermarketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Implementación del servicio de productos.
 * Gestiona operaciones CRUD y búsquedas de productos.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupermarketRepository supermarketRepository;

    @Override
    public List<ProductDTO> getAllProducts() {
        log.debug("Obteniendo todos los productos");
        return productRepository.findAll().stream()
                .map(this::convertToDto)
                .toList();
    }

    @Override
    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        Page<Product> productPage = productRepository.findAll(pageable);
        return productPage.map(this::convertToDto);
    }
    
    @Override
    public Page<ProductDTO> getProductsByCategory(Long categoryId, Pageable pageable) {
        Page<Product> productPage = productRepository.findByCategoryId(categoryId, pageable);
        return productPage.map(this::convertToDto);
    }
    
    @Override
    public Page<ProductDTO> getProductsBySupermarket(Long supermarketId, Pageable pageable) {
        Page<Product> productPage = productRepository.findBySupermarketId(supermarketId, pageable);
        return productPage.map(this::convertToDto);
    }
    
    @Override
    public Page<ProductDTO> searchProducts(String query, Pageable pageable) {
        Page<Product> productPage = productRepository.findByNameContainingIgnoreCase(query, pageable);
        return productPage.map(this::convertToDto);
    }
    
    @Override
    public Page<ProductDTO> searchProductsByCategory(String query, Long categoryId, Pageable pageable) {
        Page<Product> productPage = productRepository.findByNameContainingIgnoreCaseAndCategoryId(query, categoryId, pageable);
        return productPage.map(this::convertToDto);
    }
    
    @Override
    public Page<ProductDTO> getProductsOnSale(Pageable pageable) {
        Page<Product> productPage = productRepository.findByOnSaleTrue(pageable);
        return productPage.map(this::convertToDto);
    }
    
    @Override
    public Page<ProductDTO> getProductsOnSaleByCategory(Long categoryId, Pageable pageable) {
        Page<Product> productPage = productRepository.findByOnSaleTrueAndCategoryId(categoryId, pageable);
        return productPage.map(this::convertToDto);
    }
    
    @Override
    public Page<ProductDTO> searchProductsOnSale(String query, Pageable pageable) {
        Page<Product> productPage = productRepository.findByOnSaleTrueAndNameContainingIgnoreCase(query, pageable);
        return productPage.map(this::convertToDto);
    }
    
    @Override
    public Page<ProductDTO> searchProductsOnSaleByCategory(String query, Long categoryId, Pageable pageable) {
        Page<Product> productPage = productRepository.findByOnSaleTrueAndNameContainingIgnoreCaseAndCategoryId(query, categoryId, pageable);
        return productPage.map(this::convertToDto);
    }

    @Override
    public ProductDTO getProductById(Long id) {
        log.debug("Buscando producto con ID: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
        return convertToDto(product);
    }

    @Override
    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        log.info("Creando nuevo producto: {}", productDTO.getName());
        Product product = convertToEntity(productDTO);
        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    @Override
    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        log.info("Actualizando producto con ID: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
        
        // Actualizar campos usando Optional para código más limpio
        Optional.ofNullable(productDTO.getName()).ifPresent(product::setName);
        Optional.ofNullable(productDTO.getDescription()).ifPresent(product::setDescription);
        Optional.ofNullable(productDTO.getPrice()).ifPresent(product::setPrice);
        Optional.ofNullable(productDTO.getOriginalPrice()).ifPresent(product::setOriginalPrice);
        Optional.ofNullable(productDTO.getUnit()).ifPresent(product::setUnit);
        Optional.ofNullable(productDTO.getStock()).ifPresent(product::setStock);
        Optional.ofNullable(productDTO.getImageUrl()).ifPresent(product::setImageUrl);
        Optional.ofNullable(productDTO.getRating()).ifPresent(product::setRating);
        Optional.ofNullable(productDTO.getRatingCount()).ifPresent(product::setRatingCount);
        Optional.ofNullable(productDTO.getOnSale()).ifPresent(product::setOnSale);

        // Actualizar relaciones si se proporcionan IDs
        Optional.ofNullable(productDTO.getCategoryId())
                .flatMap(categoryRepository::findById)
                .ifPresent(product::setCategory);
        
        Optional.ofNullable(productDTO.getSupermarketId())
                .flatMap(supermarketRepository::findById)
                .ifPresent(product::setSupermarket);

        Product updatedProduct = productRepository.save(product);
        return convertToDto(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        log.info("Eliminando producto con ID: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
        productRepository.delete(product);
    }

    @Transactional
    public ProductDTO updateProductImage(Long id, String imageUrl) {
        log.debug("Actualizando imagen del producto ID: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
        product.setImageUrl(imageUrl);
        Product updated = productRepository.save(product);
        return convertToDto(updated);
    }

    private ProductDTO convertToDto(Product product) {
        ProductDTO productDTO = new ProductDTO();
        BeanUtils.copyProperties(product, productDTO, "category", "supermarket");
        if (product.getCategory() != null) {
            productDTO.setCategoryId(product.getCategory().getId());
            productDTO.setCategoryName(product.getCategory().getName());
        }
        if (product.getSupermarket() != null) {
            productDTO.setSupermarketId(product.getSupermarket().getId());
            productDTO.setSupermarketName(product.getSupermarket().getName());
        }
        return productDTO;
    }

    private Product convertToEntity(ProductDTO productDTO) {
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setOriginalPrice(productDTO.getOriginalPrice());
        product.setUnit(productDTO.getUnit());
        product.setStock(productDTO.getStock());
        product.setImageUrl(productDTO.getImageUrl());
        product.setRating(productDTO.getRating());
        product.setRatingCount(productDTO.getRatingCount());
        product.setOnSale(productDTO.getOnSale());
        
        if (productDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + productDTO.getCategoryId()));
            product.setCategory(category);
        }
        if (productDTO.getSupermarketId() != null) {
            Supermarket supermarket = supermarketRepository.findById(productDTO.getSupermarketId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supermercado no encontrado con ID: " + productDTO.getSupermarketId()));
            product.setSupermarket(supermarket);
        }
        return product;
    }
}
