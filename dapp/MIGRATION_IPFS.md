# 🔄 Migration IPFS - Résumé des changements

Ce document résume tous les changements effectués pour migrer Tickethic vers un déploiement IPFS statique.

## ✅ Changements effectués

### 1. Configuration Next.js
- **Fichier modifié** : `next.config.ts`
- **Changements** :
  - Ajout de `output: 'export'` pour l'export statique
  - Configuration `trailingSlash: true`
  - Images non optimisées pour IPFS
  - Suppression des headers API

### 2. Suppression des routes API
- **Dossier supprimé** : `src/app/api/`
- **Raison** : Les routes API ne fonctionnent pas avec l'export statique

### 3. Remplacement des appels API
- **Fichiers créés** :
  - `src/lib/ipfs.ts` - Utilitaires pour les appels IPFS directs
  - `src/lib/blockchain.ts` - Utilitaires pour les appels blockchain directs
- **Fichiers modifiés** :
  - `src/hooks/useArtistDetails.ts`
  - `src/hooks/useAllArtists.ts`
  - `src/hooks/useUserTickets.ts`
  - `src/components/EventCard.tsx`
  - `src/components/OrganizerEventsList.tsx`
  - `src/components/EventArtistsList.tsx`
  - `src/app/checkout/[eventId]/page.tsx`

### 4. Scripts de build et déploiement
- **Fichier modifié** : `package.json`
- **Scripts ajoutés** :
  - `ipfs-build` : Build pour IPFS
  - `ipfs-serve` : Serveur local pour tester
  - `ipfs-deploy` : Déploiement IPFS local
  - `ipfs-deploy-full` : Build + déploiement

### 5. Workflow GitHub Actions
- **Fichier créé** : `.github/workflows/deploy-ipfs.yml`
- **Fonctionnalités** :
  - Déploiement automatique sur IPFS
  - Support des PR avec preview
  - Commentaires automatiques avec liens IPFS
  - Statuts de commit

### 6. Configuration des fichiers
- **Fichiers créés** :
  - `ipfs.config.js` - Configuration IPFS
  - `scripts/deploy-ipfs-local.js` - Script de déploiement local
  - `env.ipfs.example` - Variables d'environnement IPFS
  - `IPFS_DEPLOYMENT.md` - Guide de déploiement
  - `MIGRATION_IPFS.md` - Ce fichier

### 7. Mise à jour des .gitignore
- **Fichiers modifiés** :
  - `.gitignore` (racine) - Configuration complète
  - `dapp/.gitignore` - Configuration spécifique Next.js

## 🚀 Comment utiliser

### Développement local
```bash
cd dapp
npm run dev
```

### Build statique
```bash
cd dapp
npm run build
```

### Test local du build statique
```bash
cd dapp
npm run ipfs-serve
```

### Déploiement IPFS local (nécessite IPFS installé)
```bash
cd dapp
npm run ipfs-deploy-full
```

### Déploiement IPFS automatique
1. Configurez les secrets GitHub (`STORACHA_KEY`, `STORACHA_PROOF`)
2. Poussez sur la branche `main`
3. Le déploiement se fait automatiquement

## 📁 Structure des fichiers générés

```
dapp/
├── out/                    # Build statique (généré)
│   ├── index.html         # Page d'accueil
│   ├── checkout/          # Pages de checkout
│   ├── _next/             # Assets Next.js
│   └── ...                # Autres pages
├── .github/workflows/     # GitHub Actions
├── scripts/               # Scripts de déploiement
└── ...                    # Fichiers de configuration
```

## 🔧 Configuration requise

### Pour le déploiement local
- Node.js 18+
- IPFS Desktop ou Kubo installé

### Pour le déploiement automatique
- Compte Storacha
- Secrets GitHub configurés
- Repository GitHub

## 🌐 Accès après déploiement

- **Local** : `http://localhost:3000` (serveur de dev)
- **Build local** : `http://localhost:3000` (serveur statique)
- **IPFS local** : `http://localhost:8080/ipfs/[CID]`
- **IPFS public** : `https://[CID].ipfs.dweb.link`

## ⚠️ Points d'attention

1. **Pages dynamiques** : Nécessitent `generateStaticParams()` pour l'export statique
2. **Images** : Non optimisées pour IPFS (configuration `unoptimized: true`)
3. **API calls** : Remplacés par des appels directs IPFS/blockchain
4. **Environment** : Variables d'environnement adaptées pour IPFS

## 🎯 Avantages de la migration

- ✅ **Décentralisé** : Plus de serveur central
- ✅ **Immutable** : Chaque déploiement a un CID unique
- ✅ **Résistant** : Fonctionne même si des nœuds tombent
- ✅ **Gratuit** : Pas de coûts d'hébergement
- ✅ **Versioning** : Historique complet des déploiements
- ✅ **Censorship-resistant** : Résistant à la censure

## 📚 Documentation

- [Guide de déploiement IPFS](IPFS_DEPLOYMENT.md)
- [Documentation IPFS Deploy Action](https://docs.ipfs.tech/how-to/websites-on-ipfs/deploy-github-action/)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

---

**🎉 Migration terminée !** Tickethic est maintenant une vraie dApp décentralisée prête pour IPFS !
