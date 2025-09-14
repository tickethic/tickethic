# Déploiement Tickethic DApp

Ce guide explique comment déployer l'application Tickethic DApp avec Docker.

## Prérequis

- Docker installé sur le serveur
- Docker Compose installé
- Accès SSH au serveur avec clé configurée

## Configuration

1. **Copiez le fichier de configuration :**
```bash
cp scripts/deploy-config.env.example scripts/deploy-config.env
```

2. **Modifiez `scripts/deploy-config.env` avec vos informations :**
```env
SERVER_HOST=votre-serveur-ip-ou-domaine
SERVER_USER=votre-utilisateur
REMOTE_PATH=/chemin/vers/votre/app
SSH_KEY=~/.ssh/votre-cle-ssh
```

3. **Copiez et adaptez le script de déploiement :**
```bash
cp scripts/deploy-template.ps1 scripts/deploy.ps1
# Modifiez scripts/deploy.ps1 avec vos paramètres
```

## Déploiement

### Option 1: Script PowerShell (Windows)
```powershell
.\scripts\deploy.ps1
```

### Option 2: Commandes manuelles
```bash
# Construire et démarrer
docker-compose up --build -d

# Vérifier le statut
docker-compose ps

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

## Configuration par défaut

- **Port par défaut :** 3001 (modifiable dans docker-compose.yml)
- **Environnement :** production
- **Redémarrage :** automatique (unless-stopped)

## Commandes utiles

```bash
# Voir les logs en temps réel
docker-compose logs -f

# Redémarrer le service
docker-compose restart

# Mettre à jour l'application
docker-compose down
docker-compose up --build -d

# Nettoyer les images inutilisées
docker system prune -a
```

## Dépannage

### Port déjà utilisé
Modifiez le port dans `docker-compose.yml` :
```yaml
ports:
  - "3002:3000"  # Changez 3001 en 3002
```

### Problèmes de build
```bash
# Nettoyer et reconstruire
docker-compose down
docker system prune -f
docker-compose up --build -d
```

### Vérifier les ressources
```bash
docker stats
```

## Sécurité

⚠️ **Important :** Ne commitez jamais :
- Les fichiers `scripts/deploy-config.env`
- Les scripts de déploiement avec vos vraies informations
- Les clés SSH ou certificats
- Les adresses IP de vos serveurs

Utilisez toujours les fichiers `.example` et `.template` comme base.