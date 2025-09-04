const ftp = require('ftp');
const fs = require('fs');
const path = require('path');

// Charger les variables d'environnement depuis .env
require('dotenv').config();

// Configuration FTP - Chargée depuis les variables d'environnement
const ftpConfig = {
  host: process.env.FTP_HOST,
  port: parseInt(process.env.FTP_PORT) || 21,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === 'true' // true pour FTPS
};

// Répertoire de destination sur le serveur
const remoteDir = process.env.FTP_REMOTE_DIR || '/';

// Répertoire local à uploader (dossier out après build)
const localDir = './out';

console.log('🚀 Début du déploiement FTP...');

// Vérification des variables d'environnement requises
const requiredEnvVars = ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variables d\'environnement manquantes:', missingVars.join(', '));
  console.error('💡 Créez un fichier .env avec vos paramètres FTP');
  process.exit(1);
}

// Fonction pour uploader un fichier
function uploadFile(client, localPath, remotePath) {
  return new Promise((resolve, reject) => {
    console.log(`📤 Upload: ${localPath} -> ${remotePath}`);
    
    client.put(localPath, remotePath, (err) => {
      if (err) {
        console.error(`❌ Erreur upload ${localPath}:`, err.message);
        reject(err);
      } else {
        console.log(`✅ Uploadé: ${remotePath}`);
        resolve();
      }
    });
  });
}

// Fonction pour créer un répertoire distant
function createRemoteDir(client, dirPath) {
  return new Promise((resolve, reject) => {
    client.mkdir(dirPath, true, (err) => {
      if (err && err.code !== 550) { // 550 = directory already exists
        console.error(`❌ Erreur création répertoire ${dirPath}:`, err.message);
        reject(err);
      } else {
        console.log(`📁 Répertoire créé/vérifié: ${dirPath}`);
        resolve();
      }
    });
  });
}

// Fonction récursive pour uploader tout un dossier
async function uploadDirectory(client, localPath, remotePath) {
  const items = fs.readdirSync(localPath);
  
  for (const item of items) {
    const localItemPath = path.join(localPath, item);
    const remoteItemPath = path.join(remotePath, item).replace(/\\/g, '/');
    
    const stat = fs.statSync(localItemPath);
    
    if (stat.isDirectory()) {
      await createRemoteDir(client, remoteItemPath);
      await uploadDirectory(client, localItemPath, remoteItemPath);
    } else {
      await uploadFile(client, localItemPath, remoteItemPath);
    }
  }
}

// Fonction principale de déploiement
async function deploy() {
  const client = new ftp();
  
  return new Promise((resolve, reject) => {
    // Connexion FTP
    client.on('ready', async () => {
      try {
        console.log('🔗 Connecté au serveur FTP');
        
        // Vérifier que le dossier out existe
        if (!fs.existsSync(localDir)) {
          throw new Error(`Le dossier ${localDir} n'existe pas. Exécutez d'abord 'npm run build'`);
        }
        
        // Créer le répertoire distant s'il n'existe pas
        await createRemoteDir(client, remoteDir);
        
        // Uploader tout le contenu
        await uploadDirectory(client, localDir, remoteDir);
        
        console.log('🎉 Déploiement terminé avec succès!');
        client.end();
        resolve();
        
      } catch (error) {
        console.error('❌ Erreur lors du déploiement:', error.message);
        client.end();
        reject(error);
      }
    });
    
    // Gestion des erreurs de connexion
    client.on('error', (err) => {
      console.error('❌ Erreur de connexion FTP:', err.message);
      reject(err);
    });
    
    // Connexion
    client.connect(ftpConfig);
  });
}

// Exécution du déploiement
deploy().catch((error) => {
  console.error('💥 Échec du déploiement:', error.message);
  process.exit(1);
});
