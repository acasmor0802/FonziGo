package fonzigo.backend.config;

import fonzigo.backend.entity.Category;
import fonzigo.backend.entity.Product;
import fonzigo.backend.entity.Supermarket;
import fonzigo.backend.repository.CategoryRepository;
import fonzigo.backend.repository.ProductRepository;
import fonzigo.backend.repository.SupermarketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Inicializador de datos de demostración para la base de datos.
 * Carga categorías, supermercados y productos al iniciar la aplicación.
 * Solo se ejecuta si las tablas están vacías.
 */
@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final SupermarketRepository supermarketRepository;
    private final ProductRepository productRepository;

    private static final int PRODUCTS_PER_SUPERMARKET = 20;
    private final Random random = new Random(42); // Seed fija para reproducibilidad

    @Override
    @Transactional
    public void run(String... args) {
        initializeDataIfEmpty();
    }

    private void initializeDataIfEmpty() {
        if (categoryRepository.count() == 0) {
            log.info("Cargando categorías iniciales...");
            loadCategories();
        }

        if (supermarketRepository.count() == 0) {
            log.info("Cargando supermercados iniciales...");
            loadSupermarkets();
        }

        if (productRepository.count() == 0) {
            log.info("Cargando productos iniciales ({} por supermercado)...", PRODUCTS_PER_SUPERMARKET);
            loadProducts();
        }

        log.info("Base de datos inicializada correctamente");
    }

    // ========================================
    // CATEGORÍAS
    // ========================================

    private void loadCategories() {
        List<Category> categories = List.of(
            buildCategory("Frutas y Verduras", "🍎", "frutas-verduras"),
            buildCategory("Lácteos y Huevos", "🥛", "lacteos-huevos"),
            buildCategory("Carnes y Pescados", "🥩", "carnes-pescados"),
            buildCategory("Panadería", "🥖", "panaderia"),
            buildCategory("Bebidas", "🥤", "bebidas"),
            buildCategory("Despensa", "🥫", "despensa"),
            buildCategory("Congelados", "🧊", "congelados"),
            buildCategory("Limpieza", "🧹", "limpieza"),
            buildCategory("Cuidado Personal", "🧴", "cuidado-personal"),
            buildCategory("Mascotas", "🐕", "mascotas")
        );
        categoryRepository.saveAll(categories);
        log.debug("Cargadas {} categorías", categories.size());
    }

    private Category buildCategory(String name, String icon, String slug) {
        Category category = new Category();
        category.setName(name);
        category.setIcon(icon);
        category.setSlug(slug);
        return category;
    }

    // ========================================
    // SUPERMERCADOS
    // ========================================

    private void loadSupermarkets() {
        List<Supermarket> supermarkets = List.of(
            buildSupermarket("Mercadona", "/images/supermarkets/mercadona.png"),
            buildSupermarket("Carrefour", "/images/supermarkets/carrefour.png"),
            buildSupermarket("Lidl", "/images/supermarkets/lidl.png"),
            buildSupermarket("Dia", "/images/supermarkets/dia.png")
        );
        supermarketRepository.saveAll(supermarkets);
        log.debug("Cargados {} supermercados", supermarkets.size());
    }

    private Supermarket buildSupermarket(String name, String logo) {
        Supermarket supermarket = new Supermarket();
        supermarket.setName(name);
        supermarket.setLogo(logo);
        return supermarket;
    }

    // ========================================
    // PRODUCTOS
    // ========================================

    private void loadProducts() {
        Map<String, Category> categories = categoryRepository.findAll().stream()
            .collect(Collectors.toMap(Category::getSlug, Function.identity()));

        List<Supermarket> supermarkets = supermarketRepository.findAll();
        List<Product> allProducts = new ArrayList<>();

        for (Supermarket supermarket : supermarkets) {
            List<Product> supermarketProducts = createProductsForSupermarket(supermarket, categories);
            allProducts.addAll(supermarketProducts);
        }

        productRepository.saveAll(allProducts);
        log.debug("Cargados {} productos en total", allProducts.size());
    }

    private List<Product> createProductsForSupermarket(Supermarket supermarket, Map<String, Category> categories) {
        List<Product> products = new ArrayList<>();

        // 2 productos por categoría = 20 productos por supermercado
        products.addAll(createFrutasProducts(supermarket, categories.get("frutas-verduras")));
        products.addAll(createLacteosProducts(supermarket, categories.get("lacteos-huevos")));
        products.addAll(createCarnesProducts(supermarket, categories.get("carnes-pescados")));
        products.addAll(createPanaderiaProducts(supermarket, categories.get("panaderia")));
        products.addAll(createBebidasProducts(supermarket, categories.get("bebidas")));
        products.addAll(createDespensaProducts(supermarket, categories.get("despensa")));
        products.addAll(createCongeladosProducts(supermarket, categories.get("congelados")));
        products.addAll(createLimpiezaProducts(supermarket, categories.get("limpieza")));
        products.addAll(createCuidadoProducts(supermarket, categories.get("cuidado-personal")));
        products.addAll(createMascotasProducts(supermarket, categories.get("mascotas")));

        return products;
    }

    // --- Productos por categoría (2 por categoría x 10 categorías = 20 productos) ---

    private List<Product> createFrutasProducts(Supermarket s, Category c) {
        return List.of(
            buildProduct("Plátanos de Canarias", "Plátanos frescos de Canarias IGP, dulces y nutritivos", 
                150, "platanos.jpg", "1.89", null, "kg", 4.5, 120, false, c, s),
            buildProduct("Manzanas Golden", "Manzanas Golden Delicious, crujientes y dulces", 
                200, "manzanas.jpg", "2.49", "2.99", "kg", 4.3, 85, true, c, s)
        );
    }

    private List<Product> createLacteosProducts(Supermarket s, Category c) {
        return List.of(
            buildProduct("Leche Entera", "Leche entera de vaca, rica en calcio y vitaminas", 
                300, "leche.jpg", "0.89", null, "litro", 4.6, 200, false, c, s),
            buildProduct("Huevos Camperos L", "Huevos camperos de gallinas en libertad, talla L", 
                150, "huevos.jpg", "3.29", "3.99", "docena", 4.7, 180, true, c, s)
        );
    }

    private List<Product> createCarnesProducts(Supermarket s, Category c) {
        return List.of(
            buildProduct("Pechuga de Pollo", "Pechuga de pollo fresca, sin hueso ni piel", 
                100, "pechuga-pollo.jpg", "6.99", null, "kg", 4.6, 110, false, c, s),
            buildProduct("Salmón Noruego", "Filetes de salmón fresco del Atlántico Norte", 
                40, "salmon.jpg", "14.99", "17.99", "kg", 4.8, 65, true, c, s)
        );
    }

    private List<Product> createPanaderiaProducts(Supermarket s, Category c) {
        return List.of(
            buildProduct("Pan de Molde Integral", "Pan de molde 100% integral, rico en fibra", 
                150, "pan-molde.jpg", "1.45", null, "unidad", 4.2, 85, false, c, s),
            buildProduct("Croissants Mantequilla", "Pack de 6 croissants artesanos de mantequilla", 
                80, "croissants.jpg", "2.49", "2.99", "pack", 4.3, 60, true, c, s)
        );
    }

    private List<Product> createBebidasProducts(Supermarket s, Category c) {
        return List.of(
            buildProduct("Agua Mineral Natural", "Pack de 6 botellas de agua mineral de manantial", 
                200, "agua.jpg", "1.99", null, "pack", 4.5, 200, false, c, s),
            buildProduct("Zumo de Naranja", "Zumo de naranja 100% exprimido, sin azúcar añadido", 
                120, "zumo-naranja.jpg", "2.49", "2.99", "litro", 4.4, 95, true, c, s)
        );
    }

    private List<Product> createDespensaProducts(Supermarket s, Category c) {
        return List.of(
            buildProduct("Aceite Oliva Virgen Extra", "AOVE de primera presión en frío, acidez 0.4º", 
                80, "aceite-oliva.jpg", "5.99", "7.50", "litro", 4.9, 200, true, c, s),
            buildProduct("Pasta Espaguetis", "Espaguetis de trigo duro, cocción al dente", 
                200, "espaguetis.jpg", "0.99", null, "500g", 4.3, 150, false, c, s)
        );
    }

    private List<Product> createCongeladosProducts(Supermarket s, Category c) {
        return List.of(
            buildProduct("Pizza 4 Quesos", "Pizza congelada con mozzarella, gorgonzola, parmesano y emmental", 
                100, "pizza.jpg", "3.49", "3.99", "unidad", 4.0, 85, true, c, s),
            buildProduct("Guisantes Finos", "Guisantes extrafinos ultracongelados", 
                90, "guisantes.jpg", "1.99", null, "kg", 4.3, 70, false, c, s)
        );
    }

    private List<Product> createLimpiezaProducts(Supermarket s, Category c) {
        return List.of(
            buildProduct("Detergente Líquido", "Detergente concentrado para lavadora, 40 lavados", 
                70, "detergente.jpg", "6.99", "8.99", "3L", 4.4, 120, true, c, s),
            buildProduct("Papel Higiénico", "Pack de 12 rollos doble capa, suave y resistente", 
                150, "papel-higienico.jpg", "4.99", null, "pack", 4.6, 200, false, c, s)
        );
    }

    private List<Product> createCuidadoProducts(Supermarket s, Category c) {
        return List.of(
            buildProduct("Gel de Ducha", "Gel de ducha hidratante con pH neutro", 
                100, "gel-ducha.jpg", "2.99", "3.49", "750ml", 4.3, 90, true, c, s),
            buildProduct("Pasta de Dientes", "Pasta dental con flúor y protección anticaries", 
                120, "pasta-dientes.jpg", "2.29", null, "75ml", 4.5, 110, false, c, s)
        );
    }

    private List<Product> createMascotasProducts(Supermarket s, Category c) {
        return List.of(
            buildProduct("Pienso Perro Adulto", "Pienso completo para perros adultos, con pollo", 
                60, "pienso-perro.jpg", "12.99", "15.99", "4kg", 4.6, 85, true, c, s),
            buildProduct("Comida Húmeda Gato", "Pack de 12 sobres de comida húmeda variada", 
                80, "comida-gato.jpg", "8.99", null, "pack", 4.5, 70, false, c, s)
        );
    }

    // --- Builder de productos ---

    private Product buildProduct(String name, String description, int stock, String image,
                                  String price, String originalPrice, String unit,
                                  double rating, int ratingCount, boolean onSale,
                                  Category category, Supermarket supermarket) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setStock(randomizeStock(stock));
        product.setImageUrl("/api/images/products/" + image);
        product.setPrice(randomizePrice(new BigDecimal(price)));
        product.setOriginalPrice(originalPrice != null ? new BigDecimal(originalPrice) : null);
        product.setUnit(unit);
        product.setRating(rating);
        product.setRatingCount(ratingCount);
        product.setOnSale(onSale);
        product.setCategory(category);
        product.setSupermarket(supermarket);
        return product;
    }

    /**
     * Añade variación al stock para que no todos los supermercados tengan el mismo.
     */
    private int randomizeStock(int baseStock) {
        int variation = (int) (baseStock * 0.3);
        return baseStock + random.nextInt(variation * 2 + 1) - variation;
    }

    /**
     * Añade pequeña variación al precio (±5%) para simular diferencias entre supermercados.
     */
    private BigDecimal randomizePrice(BigDecimal basePrice) {
        double variation = 0.95 + (random.nextDouble() * 0.10);
        return basePrice.multiply(BigDecimal.valueOf(variation))
                .setScale(2, RoundingMode.HALF_UP);
    }
}
