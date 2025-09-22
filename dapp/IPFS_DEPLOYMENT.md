# 🚀 Déploiement IPFS - Tickethic

Ce guide vous explique comment déployer Tickethic sur IPFS en utilisant GitHub Actions.

## 📋 Prérequis

1. **Compte Storacha** (gratuit) - [storacha.network](https://storacha.network)
2. **Repository GitHub** avec votre code
3. **Secrets GitHub** configurés

## 🔧 Configuration

### 1. Créer un compte Storacha

1. Allez sur [storacha.network](https://storacha.network)
2. Créez un compte gratuit
3. Installez w3cli : `npm install -g @web3-storage/w3cli`
4. Connectez-vous : `w3 login`
5. Créez un espace : `w3 space create tickethic-deploy`

### 2. Générer les clés Storacha

```bash
# Créer une clé de signature
w3 key create --json
```

**Sauvegardez la sortie JSON !** Vous en aurez besoin pour les secrets GitHub.

### 3. Créer une preuve UCAN

```bash
# Remplacer YOUR_KEY_DID par la valeur "did" de l'étape précédente
w3 delegation create did:key:YOUR_KEY_DID -c space/blob/add -c space/index/add -c filecoin/offer -c upload/add --base64
```

### 4. Configurer les secrets GitHub

Dans votre repository GitHub :
1. Allez dans **Settings** → **Secrets and variables** → **Actions**
2. Ajoutez ces secrets :

| Secret | Valeur | Description |
|--------|--------|-------------|
| `STORACHA_KEY` | Valeur "key" du JSON | Clé de signature Storacha |
| `STORACHA_PROOF` | Sortie de la commande UCAN | Preuve d'autorisation |

## 🚀 Déploiement

### Déploiement automatique

Le déploiement se fait automatiquement :
- ✅ **Push sur main** → Déploiement en production
- ✅ **Pull Request** → Déploiement de preview

### Déploiement manuel

```bash
# Build local
npm run build

# Le dossier 'out' contient votre site statique
# Vous pouvez le déployer manuellement sur IPFS
```

## 🌐 Accès à votre dApp

Après déploiement, votre dApp sera accessible via :

- **Gateway public** : `https://[CID].ipfs.dweb.link`
- **Service Worker Gateway** : `https://[CID].ipfs.inbrowser.link`
- **Storacha Gateway** : `https://[CID].ipfs.w3s.link`

## 📁 Structure du déploiement

```
out/                    # Dossier généré par Next.js export
├── index.html         # Page d'accueil
├── checkout/          # Pages de checkout
├── _next/             # Assets Next.js
└── ...                # Autres pages statiques
```

## 🔍 Vérification du déploiement

1. **GitHub Actions** : Vérifiez les logs de déploiement
2. **Commit Status** : Le statut "ipfs-deploy" apparaîtra sur vos commits
3. **PR Comments** : Les PR auront un commentaire avec les liens IPFS

## 🛠️ Dépannage

### Erreurs courantes

1. **"Build Output Directory Not Found"**
   - Vérifiez que `path-to-deploy: out` correspond à votre build
   - Assurez-vous que `npm run build` fonctionne

2. **"Authentication Issues"**
   - Vérifiez vos secrets GitHub
   - Régénérez les clés Storacha si nécessaire

3. **"Workflow Permission Issues"**
   - Vérifiez les permissions du workflow
   - Assurez-vous que le token GitHub a les bonnes permissions

### Logs utiles

- **Actions** : `https://github.com/[user]/[repo]/actions`
- **Storacha** : Dashboard Storacha pour voir les uploads

## 🎯 Avantages du déploiement IPFS

- ✅ **Décentralisé** : Pas de serveur central
- ✅ **Immutable** : Chaque déploiement a un CID unique
- ✅ **Résistant** : Fonctionne même si un nœud tombe
- ✅ **Gratuit** : Pas de coûts d'hébergement
- ✅ **Versioning** : Historique complet des déploiements

## 📚 Ressources

- [Documentation IPFS Deploy Action](https://docs.ipfs.tech/how-to/websites-on-ipfs/deploy-github-action/)
- [Storacha Documentation](https://docs.storacha.network/)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

## 🤝 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs GitHub Actions
2. Consultez la documentation Storacha
3. Ouvrez une issue sur le repository

---

**🎉 Félicitations !** Votre dApp Tickethic est maintenant déployée sur IPFS !
