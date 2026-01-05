-- FonziGo Database Initialization Script
-- Ejecutar después de que Spring Boot cree las tablas

-- ==============================================
-- CATEGORÍAS
-- ==============================================
INSERT INTO category (id, name, icon, slug) VALUES 
(1, 'Frutas y Verduras', '🍎', 'frutas-verduras'),
(2, 'Lácteos y Huevos', '🥛', 'lacteos-huevos'),
(3, 'Carnes y Pescados', '🥩', 'carnes-pescados'),
(4, 'Panadería', '🥖', 'panaderia'),
(5, 'Bebidas', '🥤', 'bebidas'),
(6, 'Despensa', '🥫', 'despensa'),
(7, 'Congelados', '🧊', 'congelados'),
(8, 'Limpieza', '🧹', 'limpieza'),
(9, 'Cuidado Personal', '🧴', 'cuidado-personal'),
(10, 'Mascotas', '🐕', 'mascotas')
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- SUPERMERCADOS
-- ==============================================
INSERT INTO supermarket (id, name, logo) VALUES 
(1, 'Mercadona', '/images/supermarkets/mercadona.png'),
(2, 'Carrefour', '/images/supermarkets/carrefour.png'),
(3, 'Lidl', '/images/supermarkets/lidl.png'),
(4, 'Dia', '/images/supermarkets/dia.png'),
(5, 'Alcampo', '/images/supermarkets/alcampo.png'),
(6, 'Eroski', '/images/supermarkets/eroski.png')
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- PRODUCTOS
-- ==============================================
-- Las imágenes van en: backend/uploads/products/
-- O puedes usar URLs externas para desarrollo

-- Frutas y Verduras
INSERT INTO product (id, name, description, stock, image_url, price, original_price, unit, rating, rating_count, on_sale, category_id, supermarket_id) VALUES
(1, 'Plátanos de Canarias', 'Plátanos frescos de Canarias, dulces y nutritivos', 150, '/api/images/products/platanos.jpg', 1.99, NULL, 'kg', 4.5, 120, false, 1, 1),
(2, 'Manzanas Golden', 'Manzanas Golden Delicious crujientes y dulces', 200, '/api/images/products/manzanas.jpg', 2.49, 2.99, 'kg', 4.3, 85, true, 1, 1),
(3, 'Tomates Rama', 'Tomates en rama, ideales para ensaladas', 100, '/api/images/products/tomates.jpg', 2.89, NULL, 'kg', 4.7, 95, false, 1, 2),
(4, 'Lechuga Romana', 'Lechuga fresca y crujiente', 80, '/api/images/products/lechuga.jpg', 0.99, NULL, 'unidad', 4.2, 60, false, 1, 1),
(5, 'Zanahorias', 'Zanahorias frescas, ricas en vitamina A', 120, '/api/images/products/zanahorias.jpg', 1.29, NULL, 'kg', 4.4, 70, false, 1, 3),
(6, 'Naranjas de Valencia', 'Naranjas dulces para zumo o mesa', 180, '/api/images/products/naranjas.jpg', 1.79, 2.19, 'kg', 4.8, 150, true, 1, 2),
(7, 'Aguacates', 'Aguacates maduros listos para consumir', 60, '/api/images/products/aguacates.jpg', 3.99, NULL, 'unidad', 4.1, 45, false, 1, 1),
(8, 'Pimientos Tricolor', 'Pack de pimientos rojo, amarillo y verde', 70, '/api/images/products/pimientos.jpg', 2.99, 3.49, 'pack', 4.3, 55, true, 1, 4),

-- Lácteos y Huevos
(9, 'Leche Entera Hacendado', 'Leche entera de vaca 1L', 300, '/api/images/products/leche.jpg', 0.89, NULL, 'litro', 4.6, 200, false, 2, 1),
(10, 'Huevos Camperos L', 'Huevos camperos talla L, docena', 150, '/api/images/products/huevos.jpg', 3.29, 3.99, 'docena', 4.7, 180, true, 2, 3),
(11, 'Yogur Natural', 'Pack de 8 yogures naturales', 200, '/api/images/products/yogur.jpg', 1.80, NULL, 'pack', 4.4, 95, false, 2, 1),
(12, 'Queso Manchego Curado', 'Queso manchego curado 6 meses', 50, '/api/images/products/queso-manchego.jpg', 12.99, NULL, 'kg', 4.9, 75, false, 2, 2),
(13, 'Mantequilla', 'Mantequilla sin sal 250g', 100, '/api/images/products/mantequilla.jpg', 2.49, NULL, 'unidad', 4.5, 65, false, 2, 1),
(14, 'Queso Fresco Batido', 'Queso fresco batido 0% MG', 90, '/api/images/products/queso-fresco.jpg', 1.99, 2.29, 'unidad', 4.2, 80, true, 2, 1),

-- Carnes y Pescados
(15, 'Pechuga de Pollo', 'Pechuga de pollo fresca', 100, '/api/images/products/pechuga-pollo.jpg', 6.99, NULL, 'kg', 4.6, 110, false, 3, 1),
(16, 'Carne Picada Mixta', 'Mezcla de vacuno y cerdo', 80, '/api/images/products/carne-picada.jpg', 7.49, NULL, 'kg', 4.4, 90, false, 3, 2),
(17, 'Salmón Noruego', 'Filetes de salmón fresco', 40, '/api/images/products/salmon.jpg', 14.99, 17.99, 'kg', 4.8, 65, true, 3, 1),
(18, 'Jamón Cocido Extra', 'Jamón cocido extra loncheado 200g', 120, '/api/images/products/jamon-cocido.jpg', 2.50, NULL, 'pack', 4.3, 100, false, 3, 1),
(19, 'Merluza Filetes', 'Filetes de merluza sin espinas', 60, '/api/images/products/merluza.jpg', 9.99, NULL, 'kg', 4.5, 55, false, 3, 3),
(20, 'Costillas de Cerdo', 'Costillas de cerdo frescas', 70, '/api/images/products/costillas.jpg', 5.99, 6.99, 'kg', 4.4, 70, true, 3, 4),

-- Panadería
(21, 'Pan de Molde Integral', 'Pan de molde 100% integral', 150, '/api/images/products/pan-molde.jpg', 1.45, NULL, 'unidad', 4.2, 85, false, 4, 1),
(22, 'Baguette Tradicional', 'Baguette crujiente recién horneada', 100, '/api/images/products/baguette.jpg', 0.79, NULL, 'unidad', 4.6, 120, false, 4, 2),
(23, 'Croissants Pack 6', 'Croissants de mantequilla', 80, '/api/images/products/croissants.jpg', 2.49, 2.99, 'pack', 4.3, 60, true, 4, 1),
(24, 'Magdalenas Caseras', 'Magdalenas tradicionales pack 12', 90, '/api/images/products/magdalenas.jpg', 2.29, NULL, 'pack', 4.1, 50, false, 4, 3),

-- Bebidas
(25, 'Agua Mineral 6L', 'Pack de 6 botellas de agua mineral', 200, '/api/images/products/agua.jpg', 1.99, NULL, 'pack', 4.5, 200, false, 5, 1),
(26, 'Coca-Cola Pack 6', 'Pack de 6 latas de Coca-Cola', 150, '/api/images/products/coca-cola.jpg', 4.99, 5.99, 'pack', 4.7, 180, true, 5, 2),
(27, 'Zumo de Naranja', 'Zumo de naranja 100% exprimido 1L', 120, '/api/images/products/zumo-naranja.jpg', 2.49, NULL, 'litro', 4.4, 95, false, 5, 1),
(28, 'Cerveza Pack 12', 'Pack de 12 cervezas Mahou', 100, '/api/images/products/cerveza.jpg', 8.99, 10.99, 'pack', 4.6, 150, true, 5, 3),
(29, 'Café Molido Natural', 'Café molido mezcla 250g', 100, '/api/images/products/cafe.jpg', 3.45, NULL, 'unidad', 4.5, 110, false, 5, 1),

-- Despensa
(30, 'Aceite de Oliva Virgen Extra', 'AOVE 1L calidad premium', 80, '/api/images/products/aceite-oliva.jpg', 5.99, 7.50, 'litro', 4.9, 200, true, 6, 1),
(31, 'Arroz Basmati', 'Arroz basmati grano largo 1kg', 120, '/api/images/products/arroz.jpg', 2.29, NULL, 'kg', 4.4, 80, false, 6, 2),
(32, 'Pasta Espaguetis', 'Espaguetis de trigo duro 500g', 200, '/api/images/products/espaguetis.jpg', 0.99, NULL, 'unidad', 4.3, 150, false, 6, 1),
(33, 'Tomate Frito', 'Tomate frito casero 400g', 180, '/api/images/products/tomate-frito.jpg', 1.19, NULL, 'unidad', 4.2, 100, false, 6, 1),
(34, 'Atún en Aceite', 'Pack 3 latas de atún en aceite', 150, '/api/images/products/atun.jpg', 3.49, 3.99, 'pack', 4.5, 130, true, 6, 3),
(35, 'Legumbres Cocidas', 'Garbanzos cocidos 400g', 100, '/api/images/products/garbanzos.jpg', 0.89, NULL, 'unidad', 4.1, 60, false, 6, 1),

-- Congelados
(36, 'Guisantes Congelados', 'Guisantes finos congelados 1kg', 90, '/api/images/products/guisantes.jpg', 1.99, NULL, 'kg', 4.3, 70, false, 7, 1),
(37, 'Pizza Congelada', 'Pizza 4 quesos congelada', 100, '/api/images/products/pizza.jpg', 3.49, 3.99, 'unidad', 4.0, 85, true, 7, 2),
(38, 'Helado Vainilla', 'Tarrina de helado de vainilla 500ml', 80, '/api/images/products/helado.jpg', 2.99, NULL, 'unidad', 4.5, 95, false, 7, 1),
(39, 'Patatas Fritas Congeladas', 'Patatas para freír 1kg', 110, '/api/images/products/patatas-congeladas.jpg', 2.49, NULL, 'kg', 4.2, 80, false, 7, 3),

-- Limpieza
(40, 'Detergente Líquido', 'Detergente para lavadora 3L', 70, '/api/images/products/detergente.jpg', 6.99, 8.99, 'unidad', 4.4, 120, true, 8, 1),
(41, 'Lavavajillas', 'Lavavajillas concentrado 1L', 90, '/api/images/products/lavavajillas.jpg', 2.49, NULL, 'unidad', 4.3, 85, false, 8, 2),
(42, 'Papel Higiénico', 'Pack 12 rollos doble capa', 150, '/api/images/products/papel-higienico.jpg', 4.99, NULL, 'pack', 4.6, 200, false, 8, 1),
(43, 'Lejía', 'Lejía con detergente 2L', 80, '/api/images/products/lejia.jpg', 1.79, NULL, 'unidad', 4.2, 70, false, 8, 3),

-- Cuidado Personal
(44, 'Gel de Ducha', 'Gel de ducha hidratante 750ml', 100, '/api/images/products/gel-ducha.jpg', 2.99, 3.49, 'unidad', 4.3, 90, true, 9, 1),
(45, 'Champú', 'Champú para cabello normal 400ml', 90, '/api/images/products/champu.jpg', 3.49, NULL, 'unidad', 4.4, 80, false, 9, 2),
(46, 'Pasta de Dientes', 'Dentífrico protección total 75ml', 120, '/api/images/products/pasta-dientes.jpg', 1.99, NULL, 'unidad', 4.5, 150, false, 9, 1),
(47, 'Desodorante', 'Desodorante roll-on 50ml', 100, '/api/images/products/desodorante.jpg', 2.49, NULL, 'unidad', 4.2, 70, false, 9, 3),

-- Mascotas
(48, 'Pienso Perro Adulto', 'Pienso completo perros adultos 4kg', 50, '/api/images/products/pienso-perro.jpg', 12.99, 14.99, 'unidad', 4.6, 85, true, 10, 1),
(49, 'Comida Gato', 'Comida húmeda para gatos pack 12', 60, '/api/images/products/comida-gato.jpg', 8.99, NULL, 'pack', 4.5, 70, false, 10, 2),
(50, 'Arena para Gatos', 'Arena aglomerante 10L', 40, '/api/images/products/arena-gatos.jpg', 5.99, NULL, 'unidad', 4.3, 55, false, 10, 1),

-- ==============================================
-- PRODUCTOS DIA (REALES)
-- ==============================================
-- Frutas y Verduras - Dia
(51, 'Plátanos Dia', 'Plátanos de Canarias IGP', 100, '/api/images/products/platanos-dia.jpg', 1.89, NULL, 'kg', 4.4, 90, false, 1, 4),
(52, 'Manzanas Fuji Dia', 'Manzanas Fuji selección', 80, '/api/images/products/manzanas-dia.jpg', 2.29, NULL, 'kg', 4.2, 65, false, 1, 4),
(53, 'Tomates Pera Dia', 'Tomates pera para ensalada', 90, '/api/images/products/tomates-dia.jpg', 2.59, 2.99, 'kg', 4.3, 70, true, 1, 4),
(54, 'Patatas Dia', 'Patatas nuevas lavadas', 120, '/api/images/products/patatas-dia.jpg', 1.49, NULL, 'kg', 4.1, 85, false, 1, 4),
(55, 'Cebollas Dia', 'Cebollas doradas malla 1kg', 100, '/api/images/products/cebollas-dia.jpg', 1.19, NULL, 'kg', 4.0, 55, false, 1, 4),
(56, 'Pimientos Rojos Dia', 'Pimientos rojos de primera', 70, '/api/images/products/pimientos-dia.jpg', 2.99, 3.49, 'kg', 4.2, 50, true, 1, 4),

-- Lácteos - Dia
(57, 'Leche Entera Dia', 'Leche entera UHT 1L', 200, '/api/images/products/leche-dia.jpg', 0.79, NULL, 'litro', 4.5, 180, false, 2, 4),
(58, 'Leche Semidesnatada Dia', 'Leche semidesnatada UHT 1L', 200, '/api/images/products/leche-semi-dia.jpg', 0.79, NULL, 'litro', 4.4, 160, false, 2, 4),
(59, 'Yogur Natural Dia', 'Yogur natural pack 8 uds', 150, '/api/images/products/yogur-dia.jpg', 1.59, NULL, 'pack', 4.3, 100, false, 2, 4),
(60, 'Yogur Griego Dia', 'Yogur estilo griego natural', 100, '/api/images/products/yogur-griego-dia.jpg', 1.99, 2.29, 'pack', 4.4, 75, true, 2, 4),
(61, 'Queso Tierno Dia', 'Queso tierno en lonchas 200g', 80, '/api/images/products/queso-dia.jpg', 1.89, NULL, 'unidad', 4.2, 65, false, 2, 4),
(62, 'Mantequilla Dia', 'Mantequilla pastilla 250g', 90, '/api/images/products/mantequilla-dia.jpg', 2.19, NULL, 'unidad', 4.3, 70, false, 2, 4),
(63, 'Huevos Dia M', 'Huevos frescos categoría A talla M', 120, '/api/images/products/huevos-dia.jpg', 2.39, NULL, 'docena', 4.5, 110, false, 2, 4),
(64, 'Nata para Cocinar Dia', 'Nata líquida para cocinar 200ml', 70, '/api/images/products/nata-dia.jpg', 0.99, NULL, 'unidad', 4.1, 45, false, 2, 4),

-- Carnes - Dia
(65, 'Pechuga Pollo Dia', 'Pechuga de pollo fileteada', 80, '/api/images/products/pechuga-dia.jpg', 6.49, 7.49, 'kg', 4.4, 85, true, 3, 4),
(66, 'Carne Picada Ternera Dia', 'Carne picada de ternera', 60, '/api/images/products/carne-picada-dia.jpg', 8.99, NULL, 'kg', 4.3, 60, false, 3, 4),
(67, 'Jamón Serrano Dia', 'Jamón serrano en lonchas 200g', 100, '/api/images/products/jamon-dia.jpg', 3.49, NULL, 'unidad', 4.5, 95, false, 3, 4),
(68, 'Pavo Pechuga Dia', 'Pechuga de pavo en lonchas 200g', 90, '/api/images/products/pavo-dia.jpg', 2.29, NULL, 'unidad', 4.2, 70, false, 3, 4),
(69, 'Chorizo Extra Dia', 'Chorizo extra en lonchas 200g', 80, '/api/images/products/chorizo-dia.jpg', 2.69, 2.99, 'unidad', 4.3, 65, true, 3, 4),
(70, 'Bacon Ahumado Dia', 'Bacon ahumado en lonchas 200g', 75, '/api/images/products/bacon-dia.jpg', 2.49, NULL, 'unidad', 4.1, 55, false, 3, 4),

-- Panadería - Dia
(71, 'Pan de Molde Dia', 'Pan de molde blanco 460g', 120, '/api/images/products/pan-dia.jpg', 1.09, NULL, 'unidad', 4.2, 90, false, 4, 4),
(72, 'Pan Integral Dia', 'Pan de molde integral 460g', 100, '/api/images/products/pan-integral-dia.jpg', 1.29, NULL, 'unidad', 4.3, 75, false, 4, 4),
(73, 'Bollería Surtida Dia', 'Bollería surtida pack 6 uds', 60, '/api/images/products/bolleria-dia.jpg', 1.99, 2.49, 'pack', 4.0, 50, true, 4, 4),
(74, 'Tostadas Dia', 'Pan tostado tradicional 270g', 80, '/api/images/products/tostadas-dia.jpg', 1.39, NULL, 'unidad', 4.1, 65, false, 4, 4),

-- Bebidas - Dia
(75, 'Agua Mineral Dia', 'Agua mineral natural pack 6x1.5L', 150, '/api/images/products/agua-dia.jpg', 1.49, NULL, 'pack', 4.4, 140, false, 5, 4),
(76, 'Zumo Naranja Dia', 'Zumo de naranja 100% 1L', 100, '/api/images/products/zumo-dia.jpg', 1.89, NULL, 'litro', 4.3, 85, false, 5, 4),
(77, 'Refresco Cola Dia', 'Refresco de cola pack 6 latas', 90, '/api/images/products/cola-dia.jpg', 2.99, 3.49, 'pack', 4.2, 70, true, 5, 4),
(78, 'Cerveza Dia', 'Cerveza lager pack 6 latas', 80, '/api/images/products/cerveza-dia.jpg', 2.49, NULL, 'pack', 4.1, 65, false, 5, 4),
(79, 'Café Molido Dia', 'Café molido mezcla 250g', 70, '/api/images/products/cafe-dia.jpg', 2.89, NULL, 'unidad', 4.4, 90, false, 5, 4),
(80, 'Leche con Cacao Dia', 'Batido de cacao pack 3x200ml', 100, '/api/images/products/cacao-dia.jpg', 1.29, NULL, 'pack', 4.3, 80, false, 5, 4),

-- Despensa - Dia
(81, 'Aceite Oliva Dia', 'Aceite de oliva virgen extra 1L', 60, '/api/images/products/aceite-dia.jpg', 5.49, 6.49, 'litro', 4.6, 110, true, 6, 4),
(82, 'Aceite Girasol Dia', 'Aceite de girasol 1L', 80, '/api/images/products/girasol-dia.jpg', 1.99, NULL, 'litro', 4.2, 75, false, 6, 4),
(83, 'Arroz Redondo Dia', 'Arroz redondo extra 1kg', 100, '/api/images/products/arroz-dia.jpg', 1.39, NULL, 'kg', 4.3, 85, false, 6, 4),
(84, 'Pasta Macarrones Dia', 'Macarrones 500g', 120, '/api/images/products/macarrones-dia.jpg', 0.85, NULL, 'unidad', 4.2, 70, false, 6, 4),
(85, 'Tomate Frito Dia', 'Tomate frito casero 400g', 150, '/api/images/products/tomate-dia.jpg', 0.99, NULL, 'unidad', 4.1, 100, false, 6, 4),
(86, 'Atún Claro Dia', 'Atún claro en aceite pack 3', 100, '/api/images/products/atun-dia.jpg', 2.99, 3.49, 'pack', 4.4, 95, true, 6, 4),
(87, 'Garbanzos Dia', 'Garbanzos cocidos 400g', 80, '/api/images/products/garbanzos-dia.jpg', 0.79, NULL, 'unidad', 4.0, 55, false, 6, 4),
(88, 'Lentejas Dia', 'Lentejas pardinas 500g', 90, '/api/images/products/lentejas-dia.jpg', 1.19, NULL, 'unidad', 4.1, 60, false, 6, 4),
(89, 'Azúcar Blanco Dia', 'Azúcar blanco 1kg', 100, '/api/images/products/azucar-dia.jpg', 1.09, NULL, 'kg', 4.2, 65, false, 6, 4),
(90, 'Sal Fina Dia', 'Sal fina de mesa 1kg', 120, '/api/images/products/sal-dia.jpg', 0.45, NULL, 'kg', 4.0, 50, false, 6, 4),

-- Congelados - Dia
(91, 'Guisantes Dia', 'Guisantes finos congelados 1kg', 70, '/api/images/products/guisantes-dia.jpg', 1.79, NULL, 'kg', 4.2, 55, false, 7, 4),
(92, 'Croquetas Dia', 'Croquetas de jamón 500g', 60, '/api/images/products/croquetas-dia.jpg', 2.49, 2.99, 'unidad', 4.3, 70, true, 7, 4),
(93, 'Pizza Dia', 'Pizza 4 quesos 400g', 80, '/api/images/products/pizza-dia.jpg', 2.99, NULL, 'unidad', 4.1, 65, false, 7, 4),
(94, 'Helado Vainilla Dia', 'Helado de vainilla 900ml', 50, '/api/images/products/helado-dia.jpg', 2.49, NULL, 'unidad', 4.4, 60, false, 7, 4),
(95, 'Patatas Fritas Dia', 'Patatas prefritas congeladas 1kg', 90, '/api/images/products/patatas-fritas-dia.jpg', 1.99, NULL, 'kg', 4.2, 75, false, 7, 4),

-- Limpieza - Dia
(96, 'Detergente Dia', 'Detergente líquido 3L', 60, '/api/images/products/detergente-dia.jpg', 5.99, 7.49, 'unidad', 4.3, 80, true, 8, 4),
(97, 'Suavizante Dia', 'Suavizante concentrado 1.5L', 70, '/api/images/products/suavizante-dia.jpg', 2.49, NULL, 'unidad', 4.2, 65, false, 8, 4),
(98, 'Lavavajillas Dia', 'Lavavajillas concentrado 1L', 80, '/api/images/products/lavavajillas-dia.jpg', 1.99, NULL, 'unidad', 4.1, 70, false, 8, 4),
(99, 'Lejía Dia', 'Lejía con detergente 2L', 90, '/api/images/products/lejia-dia.jpg', 1.49, NULL, 'unidad', 4.0, 55, false, 8, 4),
(100, 'Papel Higiénico Dia', 'Papel higiénico pack 12 rollos', 100, '/api/images/products/papel-dia.jpg', 3.99, NULL, 'pack', 4.4, 120, false, 8, 4),
(101, 'Papel Cocina Dia', 'Papel de cocina pack 4 rollos', 80, '/api/images/products/papel-cocina-dia.jpg', 2.29, NULL, 'pack', 4.2, 75, false, 8, 4),

-- Cuidado Personal - Dia
(102, 'Gel Ducha Dia', 'Gel de ducha 750ml', 70, '/api/images/products/gel-dia.jpg', 1.99, 2.49, 'unidad', 4.1, 60, true, 9, 4),
(103, 'Champú Dia', 'Champú uso frecuente 400ml', 60, '/api/images/products/champu-dia.jpg', 2.29, NULL, 'unidad', 4.2, 55, false, 9, 4),
(104, 'Pasta Dientes Dia', 'Pasta de dientes protección 75ml', 80, '/api/images/products/pasta-dia.jpg', 1.49, NULL, 'unidad', 4.3, 70, false, 9, 4),
(105, 'Desodorante Dia', 'Desodorante spray 200ml', 70, '/api/images/products/deo-dia.jpg', 1.99, NULL, 'unidad', 4.0, 50, false, 9, 4),

-- Mascotas - Dia
(106, 'Pienso Perro Dia', 'Pienso perro adulto 4kg', 40, '/api/images/products/pienso-perro-dia.jpg', 9.99, 11.99, 'unidad', 4.3, 50, true, 10, 4),
(107, 'Comida Gato Dia', 'Comida húmeda gato pack 12', 50, '/api/images/products/gato-dia.jpg', 6.99, NULL, 'pack', 4.2, 45, false, 10, 4),
(108, 'Arena Gatos Dia', 'Arena aglomerante 5kg', 60, '/api/images/products/arena-dia.jpg', 3.99, NULL, 'unidad', 4.1, 40, false, 10, 4)
ON CONFLICT (id) DO NOTHING;

-- Reset sequences
SELECT setval('category_id_seq', (SELECT MAX(id) FROM category));
SELECT setval('supermarket_id_seq', (SELECT MAX(id) FROM supermarket));
SELECT setval('product_id_seq', (SELECT MAX(id) FROM product));
