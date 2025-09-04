# FTP Deployment

This guide explains how to deploy your dapp to a static hosting via FTP.

## Configuration

1. **Copy the configuration file:**
   ```bash
   cp env.example .env
   ```

2. **Edit the `.env` file with your FTP settings:**
   ```env
   FTP_HOST=ftp.your-domain.com
   FTP_PORT=21
   FTP_USER=your-username
   FTP_PASSWORD=your-password
   FTP_REMOTE_DIR=/public_html
   ```

## Deployment

### Option 1: Automatic deployment
```bash
npm run deploy
```

### Option 2: Manual steps
```bash
# 1. Install dependencies
npm install

# 2. Build the application
npm run build

# 3. Deploy via FTP
node deploy.js
```

## File structure

- `deploy.js` : FTP deployment script
- `env.example` : Configuration template
- `.env` : Your FTP settings (to be created)

## Common hosting providers

### OVH
- **FTP_HOST** : `ftp.cluster0XX.ovh.net` or `ftp.your-domain.com`
- **FTP_REMOTE_DIR** : `/www`

### Infomaniak
- **FTP_HOST** : `ftp.infomaniak.com`
- **FTP_REMOTE_DIR** : `/www`

### Hostinger
- **FTP_HOST** : `ftp.your-domain.com`
- **FTP_REMOTE_DIR** : `/public_html`

## Troubleshooting

- Check that the `out` folder exists after build
- Verify your FTP settings in the `.env` file
- Make sure your hosting supports static files
