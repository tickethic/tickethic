# Déploiement FTP

Ce guide explique comment déployer votre dapp sur un hébergement statique via FTP.

## Configuration

1. **Copiez le fichier de configuration :**
   ```bash
   cp env.example .env
   ```

2. **Modifiez le fichier `.env` avec vos paramètres FTP :**
   ```env
   FTP_HOST=ftp.votre-domaine.com
   FTP_PORT=21
   FTP_USER=votre-utilisateur
   FTP_PASSWORD=votre-mot-de-passe
   FTP_REMOTE_DIR=/public_html
   ```

## Déploiement

### Option 1: Déploiement automatique
```bash
npm run deploy
```

### Option 2: Étapes manuelles
```bash
# 1. Installer les dépendances
npm install

# 2. Builder l'application
npm run build

# 3. Déployer via FTP
node deploy.js
```

## Structure des fichiers

- `deploy.js` : Script de déploiement FTP
- `env.example` : Template de configuration
- `.env` : Vos paramètres FTP (à créer)

## Hébergements courants

### OVH
- **FTP_HOST** : `ftp.cluster0XX.ovh.net` ou `ftp.votre-domaine.com`
- **FTP_REMOTE_DIR** : `/www`

### Infomaniak
- **FTP_HOST** : `ftp.infomaniak.com`
- **FTP_REMOTE_DIR** : `/www`

### Hostinger
- **FTP_HOST** : `ftp.votre-domaine.com`
- **FTP_REMOTE_DIR** : `/public_html`

## Dépannage

- Vérifiez que le dossier `out` existe après le build
- Vérifiez vos paramètres FTP dans le fichier `.env`
- Assurez-vous que votre hébergement supporte les fichiers statiques
