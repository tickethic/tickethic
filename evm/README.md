# Tickethic - Event Ticketing System

Un système de billetterie d'événements décentralisé construit avec Solidity et Hardhat 3 Beta.

## Vue d'ensemble du projet

Ce projet comprend :

- **Artist.sol** - Contrat pour gérer les artistes (NFT ERC721)
- **Ticket.sol** - Contrat pour les billets d'événement (NFT ERC721)
- **Organizator.sol** - Contrat pour gérer les organisateurs
- **Event.sol** - Contrat principal pour gérer les événements et la billetterie
- **Tests Solidity** - Tests complets avec Foundry
- **Déploiement Ignition** - Déploiement automatisé avec Hardhat Ignition

## Fonctionnalités

- ✅ Création et gestion d'événements
- ✅ Vente de billets avec paiement en ETH
- ✅ Répartition automatique des revenus entre artistes et organisateur
- ✅ Système de vérification des billets
- ✅ Gestion des organisateurs et vérificateurs
- ✅ Tests complets (14 tests passants)
- ✅ Déploiement automatisé avec Ignition

## Installation

```bash
npm install
```

## Compilation

```bash
npx hardhat compile
```

## Tests

```bash
# Tous les tests
npx hardhat test

# Tests Solidity uniquement
npx hardhat test solidity
```

## Déploiement

### Déploiement local

```bash
npx hardhat ignition deploy ignition/modules/Tickethic.ts --network localhost
```

### Déploiement sur Amoy (Polygon testnet)

```bash
# Configurer les variables d'environnement
export AMOY_RPC_URL="your_rpc_url"
export AMOY_PRIVATE_KEY="your_private_key"

# Déployer
npx hardhat ignition deploy ignition/modules/Tickethic.ts --network amoy
```

## Scripts disponibles

```bash
npm run test          # Exécuter tous les tests
npm run compile       # Compiler les contrats
npm run deploy:local  # Déployer localement
npm run deploy:amoy   # Déployer sur Amoy
```

## Architecture des contrats

### Event.sol
Le contrat principal qui gère :
- La création d'événements
- La vente de billets
- La répartition des paiements
- Le système de vérification

### Artist.sol
Contrat ERC721 pour représenter les artistes avec métadonnées.

### Ticket.sol
Contrat ERC721 pour les billets d'événement.

### Organizator.sol
Contrat pour gérer les organisateurs autorisés.

## Tests

Le projet inclut 14 tests complets qui couvrent :
- ✅ Création d'événements
- ✅ Achat de billets
- ✅ Répartition des paiements
- ✅ Système de vérification
- ✅ Gestion des erreurs
- ✅ Contrôles d'accès

## Déploiement avec Ignition

Le projet utilise Hardhat Ignition pour un déploiement automatisé et reproductible. Le module `Tickethic.ts` déploie tous les contrats dans le bon ordre avec les bonnes dépendances.

## Configuration

Le projet est configuré pour :
- Solidity 0.8.28
- Hardhat 3 Beta
- OpenZeppelin Contracts 5.4.0
- Foundry pour les tests Solidity
- Viem pour les interactions Ethereum

## Réseaux supportés

- `localhost` - Réseau local Hardhat
- `amoy` - Polygon Amoy testnet

## Sécurité

- Tous les contrats utilisent OpenZeppelin pour la sécurité
- Tests complets pour tous les cas d'usage
- Contrôles d'accès appropriés
- Validation des entrées utilisateur