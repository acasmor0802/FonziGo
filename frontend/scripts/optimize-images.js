/**
 * Script para generar múltiples tamaños de imágenes usando Sharp
 * 
 * Uso: 
 *   cd frontend
 *   npm install sharp --save-dev
 *   node scripts/optimize-images.js
 * 
 * Genera 3 tamaños por cada imagen:
 *   - small (400px ancho)
 *   - medium (800px ancho)
 *   - large (1200px ancho) - solo si la original es más grande
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuración
const INPUT_DIR = path.join(__dirname, '../public');
const OUTPUT_DIR = path.join(__dirname, '../public/optimized');
const SIZES = [
  { suffix: '-small', width: 400 },
  { suffix: '-medium', width: 800 },
  { suffix: '-large', width: 1200 }
];
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp'];

// Crear directorio de salida si no existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`📁 Creado directorio: ${OUTPUT_DIR}`);
}

async function processImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const baseName = path.basename(filePath, ext);
  
  // Ignorar archivos que ya tienen sufijo de tamaño
  if (baseName.endsWith('-small') || baseName.endsWith('-medium') || baseName.endsWith('-large')) {
    console.log(`⏭️  Ignorando (ya procesada): ${baseName}${ext}`);
    return;
  }

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    console.log(`\n🖼️  Procesando: ${baseName}${ext} (${metadata.width}x${metadata.height})`);

    for (const size of SIZES) {
      const outputFileName = `${baseName}${size.suffix}.webp`;
      const outputPath = path.join(OUTPUT_DIR, outputFileName);

      // Determinar el ancho final: el menor entre el objetivo y el original
      const targetWidth = Math.min(size.width, metadata.width);

      await sharp(filePath)
        .resize(targetWidth, null, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 80 })
        .toFile(outputPath);

      const stats = fs.statSync(outputPath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      const note = metadata.width <= size.width ? ' (usando original)' : '';
      console.log(`   ✅ ${size.suffix}: ${outputFileName} (${sizeKB} KB)${note}`);
    }

    // También crear versión WebP de la original (sin sufijo)
    const originalWebp = `${baseName}.webp`;
    const originalWebpPath = path.join(OUTPUT_DIR, originalWebp);
    
    if (ext !== '.webp') {
      await sharp(filePath)
        .webp({ quality: 85 })
        .toFile(originalWebpPath);
      
      const stats = fs.statSync(originalWebpPath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`   ✅ original: ${originalWebp} (${sizeKB} KB)`);
    } else {
      // Copiar el webp original
      fs.copyFileSync(filePath, originalWebpPath);
      const stats = fs.statSync(originalWebpPath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`   ✅ original: ${originalWebp} (${sizeKB} KB) [copiado]`);
    }

  } catch (error) {
    console.error(`   ❌ Error procesando ${baseName}${ext}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Iniciando optimización de imágenes...\n');
  console.log(`📂 Directorio entrada: ${INPUT_DIR}`);
  console.log(`📂 Directorio salida: ${OUTPUT_DIR}`);
  console.log(`📐 Tamaños: ${SIZES.map(s => s.width + 'px').join(', ')}`);
  
  const files = fs.readdirSync(INPUT_DIR);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return SUPPORTED_FORMATS.includes(ext);
  });

  console.log(`\n📷 Encontradas ${imageFiles.length} imágenes para procesar`);

  for (const file of imageFiles) {
    const filePath = path.join(INPUT_DIR, file);
    await processImage(filePath);
  }

  console.log('\n✨ ¡Optimización completada!');
  console.log(`\n📁 Las imágenes optimizadas están en: ${OUTPUT_DIR}`);
  console.log('\n💡 Próximos pasos:');
  console.log('   1. Revisa las imágenes generadas');
  console.log('   2. Actualiza los componentes para usar srcset');
  console.log('   3. Ejemplo de uso en HTML:');
  console.log(`
   <img 
     src="/optimized/producto.webp"
     srcset="/optimized/producto-small.webp 400w,
             /optimized/producto-medium.webp 800w,
             /optimized/producto-large.webp 1200w"
     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
     alt="Producto"
     loading="lazy"
   >
  `);
}

main().catch(console.error);
