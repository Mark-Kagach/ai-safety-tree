import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Safety Tree",
  description: "Community-Curated Map of AI Safety.",
};

// Runs synchronously before React hydration to avoid a theme flash.
const themeInitScript = `(function(){try{var t=localStorage.getItem('aist-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The blocking themeInitScript writes `data-theme="dark"` (or "light")
    // before React hydrates so the page paints in the correct theme. That
    // intentionally mutates the SSR HTML, so suppress the hydration
    // warning React raises about the mismatched attribute.
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="h-full flex flex-col">{children}</body>
    </html>
  );
}
