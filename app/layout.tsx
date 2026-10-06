import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrassMate",
  description: "AI that tells you to stop using AI. Outdoor micro-adventures from a model running on your own computer.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌱</text></svg>",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f8f1" },
    { media: "(prefers-color-scheme: dark)", color: "#121a14" },
  ],
};

// Applies the saved colour mode before first paint, so dark mode doesn't flash.
const colorModeScript = `try{var s=JSON.parse(localStorage.getItem("grassmate.settings.v1")||"{}");if(s.colorMode==="light"||s.colorMode==="dark")document.documentElement.dataset.theme=s.colorMode}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorModeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
