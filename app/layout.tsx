import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LifePilot — AI-powered local life assistant",
  description: "LifePilot MVP Web Demo for local life planning with mock Agent tools."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
