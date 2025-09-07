const ftp = require('ftp');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env
require('dotenv').config();

// FTP Configuration - Loaded from environment variables
const ftpConfig = {
  host: process.env.FTP_HOST,
  port: parseInt(process.env.FTP_PORT) || 21,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === 'true' // true for FTPS
};

// Destination directory on server
const remoteDir = process.env.FTP_REMOTE_DIR || '/';

// Local directory to upload (out folder after build)
const localDir = './out';

console.log('🚀 Starting FTP deployment...');

// Check required environment variables
const requiredEnvVars = ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing environment variables:', missingVars.join(', '));
  console.error('💡 Create a .env file with your FTP settings');
  process.exit(1);
}

// Function to upload a file
function uploadFile(client, localPath, remotePath) {
  return new Promise((resolve, reject) => {
    console.log(`📤 Upload: ${localPath} -> ${remotePath}`);
    
    client.put(localPath, remotePath, (err) => {
      if (err) {
        console.error(`❌ Upload error ${localPath}:`, err.message);
        reject(err);
      } else {
        console.log(`✅ Uploaded: ${remotePath}`);
        resolve();
      }
    });
  });
}

// Function to create remote directory
function createRemoteDir(client, dirPath) {
  return new Promise((resolve, reject) => {
    client.mkdir(dirPath, true, (err) => {
      if (err && err.code !== 550) { // 550 = directory already exists
        console.error(`❌ Directory creation error ${dirPath}:`, err.message);
        reject(err);
      } else {
        console.log(`📁 Directory created/verified: ${dirPath}`);
        resolve();
      }
    });
  });
}

// Recursive function to upload entire directory
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

// Main deployment function
async function deploy() {
  const client = new ftp();
  
  return new Promise((resolve, reject) => {
    // FTP connection
    client.on('ready', async () => {
      try {
        console.log('🔗 Connected to FTP server');
        
        // Check that out folder exists
        if (!fs.existsSync(localDir)) {
          throw new Error(`Folder ${localDir} does not exist. Run 'npm run build' first`);
        }
        
        // Create remote directory if it doesn't exist
        await createRemoteDir(client, remoteDir);
        
        // Upload all content
        await uploadDirectory(client, localDir, remoteDir);
        
        console.log('🎉 Deployment completed successfully!');
        client.end();
        resolve();
        
      } catch (error) {
        console.error('❌ Deployment error:', error.message);
        client.end();
        reject(error);
      }
    });
    
    // Connection error handling
    client.on('error', (err) => {
      console.error('❌ FTP connection error:', err.message);
      reject(err);
    });
    
    // Connect
    client.connect(ftpConfig);
  });
}

// Execute deployment
deploy().catch((error) => {
  console.error('💥 Deployment failed:', error.message);
  process.exit(1);
});
