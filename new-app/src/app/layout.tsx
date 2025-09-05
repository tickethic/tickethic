import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tick3thic - Plateforme événementielle pour organisateurs et artistes",
  description: "Une plateforme Web3 qui garantit des paiements directs aux artistes et une transparence totale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"></script>
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
      </head>
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}