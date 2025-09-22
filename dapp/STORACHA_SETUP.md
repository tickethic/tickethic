# 🚀 Configuration Storacha - Guide rapide

## 📋 Étapes pour configurer Storacha

### 1. Créer un compte Storacha

1. Allez sur [storacha.network](https://storacha.network)
2. Cliquez sur "Sign Up" ou "Get Started"
3. Créez votre compte (gratuit)

### 2. Installer w3cli

```bash
npm install -g @web3-storage/w3cli
```

### 3. Se connecter à Storacha

```bash
w3 login
```

Suivez les instructions pour vous connecter via votre navigateur.

### 4. Créer un espace pour Tickethic

```bash
w3 space create tickethic-deploy
```

### 5. Générer une clé de signature

```bash
w3 key create --json
```

**IMPORTANT** : Sauvegardez la sortie JSON ! Elle ressemble à ceci :
```json
{
  "did": "did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
  "key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 6. Créer une preuve UCAN

```bash
# Remplacez YOUR_KEY_DID par la valeur "did" de l'étape précédente
w3 delegation create did:key:YOUR_KEY_DID -c space/blob/add -c space/index/add -c filecoin/offer -c upload/add --base64
```

**IMPORTANT** : Sauvegardez la sortie base64 ! Elle ressemble à ceci :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔐 Configuration des secrets GitHub

1. Allez sur votre repository GitHub
2. Cliquez sur **Settings** → **Secrets and variables** → **Actions**
3. Cliquez sur **New repository secret**

### Secret 1 : STORACHA_KEY
- **Nom** : `STORACHA_KEY`
- **Valeur** : La valeur `key` du JSON de l'étape 5

### Secret 2 : STORACHA_PROOF
- **Nom** : `STORACHA_PROOF`
- **Valeur** : La sortie base64 de l'étape 6

## ✅ Vérification

Une fois les secrets configurés :

1. **Poussez sur la branche `main`** :
   ```bash
   git add .
   git commit -m "feat: migration IPFS complète"
   git push origin main
   ```

2. **Vérifiez GitHub Actions** :
   - Allez dans l'onglet "Actions" de votre repository
   - Le workflow "Deploy to IPFS" devrait se lancer automatiquement

3. **Récupérez le CID** :
   - Dans les logs du workflow, cherchez le CID généré
   - Votre dApp sera accessible via : `https://[CID].ipfs.dweb.link`

## 🎯 Exemple de configuration

```bash
# 1. Installation
npm install -g @web3-storage/w3cli

# 2. Connexion
w3 login

# 3. Création d'espace
w3 space create tickethic-deploy

# 4. Génération de clé
w3 key create --json
# Sortie : {"did": "did:key:...", "key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}

# 5. Création de preuve UCAN
w3 delegation create did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK -c space/blob/add -c space/index/add -c filecoin/offer -c upload/add --base64
# Sortie : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🆘 Dépannage

### Erreur "Authentication failed"
- Vérifiez que vous êtes bien connecté : `w3 whoami`
- Reconnectez-vous si nécessaire : `w3 login`

### Erreur "Space not found"
- Vérifiez que l'espace existe : `w3 space ls`
- Recréez l'espace si nécessaire

### Erreur GitHub Actions
- Vérifiez que les secrets sont bien configurés
- Vérifiez que les valeurs sont correctes (sans espaces, guillemets, etc.)

## 📚 Ressources

- [Documentation Storacha](https://docs.storacha.network/)
- [w3cli Documentation](https://github.com/web3-storage/w3cli)
- [IPFS Deploy Action](https://github.com/ipfs/ipfs-deploy-action)

---

**🎉 Une fois configuré, votre dApp Tickethic sera automatiquement déployée sur IPFS à chaque push sur `main` !**
