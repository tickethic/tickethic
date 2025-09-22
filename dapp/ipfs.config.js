// Configuration IPFS pour le déploiement local
module.exports = {
  // Gateways IPFS à utiliser
  gateways: [
    'https://ipfs.io/ipfs/',
    'https://dweb.link/ipfs/',
    'https://ipfs.fleek.co/ipfs/',
    'https://gateway.originprotocol.com/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://ipfs.infura.io/ipfs/'
  ],
  
  // Configuration pour le build statique
  build: {
    outputDir: 'out',
    trailingSlash: true,
    images: {
      unoptimized: true
    }
  },
  
  // Configuration pour le serveur local
  serve: {
    port: 3000,
    host: 'localhost'
  }
}
