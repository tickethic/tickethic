#!/usr/bin/env node

/**
 * Script de déploiement IPFS local
 * Utilise IPFS Desktop ou Kubo pour déployer le build statique
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '../out');
const IPFS_CONFIG = {
  // Vérifier si IPFS est installé
  checkIPFS: () => {
    try {
      execSync('ipfs --version', { stdio: 'pipe' });
      return true;
    } catch (error) {
      return false;
    }
  },
  
  // Ajouter le dossier au nœud IPFS local
  addToIPFS: () => {
    try {
      console.log('🚀 Ajout du build à IPFS...');
      const result = execSync(`ipfs add -r ${BUILD_DIR}`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      // Extraire le CID du dernier fichier ajouté (index.html)
      const lines = result.trim().split('\n');
      const lastLine = lines[lines.length - 1];
      const cid = lastLine.split(' ')[1];
      
      console.log(`✅ Build ajouté à IPFS avec le CID: ${cid}`);
      console.log(`🌐 Accessible via: http://localhost:8080/ipfs/${cid}`);
      console.log(`🌐 Ou via: https://${cid}.ipfs.dweb.link`);
      
      return cid;
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout à IPFS:', error.message);
      return null;
    }
  },
  
  // Épingler le contenu
  pinContent: (cid) => {
    try {
      console.log('📌 Épinglage du contenu...');
      execSync(`ipfs pin add ${cid}`, { stdio: 'pipe' });
      console.log('✅ Contenu épinglé avec succès');
    } catch (error) {
      console.warn('⚠️  Impossible d\'épingler le contenu:', error.message);
    }
  }
};

// Fonction principale
async function deployToIPFS() {
  console.log('🎫 Déploiement de Tickethic sur IPFS local...\n');
  
  // Vérifier que le dossier de build existe
  if (!fs.existsSync(BUILD_DIR)) {
    console.error('❌ Le dossier de build n\'existe pas. Exécutez d\'abord: npm run build');
    process.exit(1);
  }
  
  // Vérifier si IPFS est installé
  if (!IPFS_CONFIG.checkIPFS()) {
    console.error('❌ IPFS n\'est pas installé ou n\'est pas dans le PATH');
    console.log('📥 Installez IPFS Desktop ou Kubo: https://ipfs.tech/install/');
    process.exit(1);
  }
  
  // Ajouter à IPFS
  const cid = IPFS_CONFIG.addToIPFS();
  if (!cid) {
    process.exit(1);
  }
  
  // Épingler le contenu
  IPFS_CONFIG.pinContent(cid);
  
  console.log('\n🎉 Déploiement terminé !');
  console.log(`📋 CID: ${cid}`);
  console.log(`🔗 Liens d'accès:`);
  console.log(`   - Local: http://localhost:8080/ipfs/${cid}`);
  console.log(`   - Public: https://${cid}.ipfs.dweb.link`);
  console.log(`   - SW Gateway: https://${cid}.ipfs.inbrowser.link`);
}

// Exécuter le script
if (require.main === module) {
  deployToIPFS().catch(console.error);
}

module.exports = { deployToIPFS, IPFS_CONFIG };
