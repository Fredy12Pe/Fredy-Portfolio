import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

async function optimizeImages() {
  console.log('Starting image optimization...');
  
  // Create backup directory
  const backupDir = 'public/images-backup';
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Backup original images
  console.log('Backing up original images...');
  const imagesDir = 'public/images';
  const files = await imagemin([`${imagesDir}/**/*.png`], {
    destination: backupDir,
    plugins: []
  });
  
  // Copy files to backup
  execSync(`cp -r ${imagesDir}/* ${backupDir}/`);
  
  console.log('Optimizing images...');
  
  // Optimize images
  await imagemin([`${imagesDir}/**/*.png`], {
    destination: imagesDir,
    plugins: [
      imageminPngquant({
        quality: [0.6, 0.8], // Reduce quality to 60-80%
        speed: 1
      })
    ]
  });
  
  console.log('Image optimization complete!');
  console.log('Original images backed up to:', backupDir);
}

optimizeImages().catch(console.error);
