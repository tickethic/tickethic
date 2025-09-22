import type { Metadata } from "next";
import "./globals.css";
import ContextProvider from "@/context";

export const metadata: Metadata = {
  title: "Tickethic - Plateforme événementielle pour organisateurs et artistes",
  description: "Une plateforme Web3 qui garantit des paiements directs aux artistes et une transparence totale.",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Content Security Policy pour résoudre les problèmes avec IPFS */}
        <meta 
          httpEquiv="Content-Security-Policy" 
          content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; connect-src 'self' https: wss: ws: https://rpc.walletconnect.org https://*.walletconnect.org https://*.storacha.link https://*.w3s.link https://*.nftstorage.link https://*.dweb.link https://ipfs.io https://gateway.originprotocol.com https://dweb.link; img-src 'self' data: https: blob: https://*.storacha.link https://*.w3s.link https://*.nftstorage.link https://*.dweb.link https://ipfs.io https://gateway.originprotocol.com https://dweb.link https://avatars.githubusercontent.com; font-src 'self' data: https: https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https: https://fonts.googleapis.com https://unpkg.com https://cdnjs.cloudflare.com; style-src-elem 'self' 'unsafe-inline' https: https://fonts.googleapis.com https://unpkg.com https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: https://unpkg.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; frame-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'" 
        />
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"></script>
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
      </head>
      <body className="bg-gray-50">
        <ContextProvider>
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}