import { DNSProvider } from "@/utils/DNSProvider";
import "./globals.css";

export const metadata = {
  title: "DeNS App",
  description: "Decentralized DNS | Adya Sena",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DNSProvider>{children}</DNSProvider>
      </body>
    </html>
  );
}
