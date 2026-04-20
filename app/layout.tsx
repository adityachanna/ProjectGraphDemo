import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Conversational Expert System",
  description: "A student career guidance expert system with graph reasoning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
