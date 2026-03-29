import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "egg-shell porcelain",
  description: "A minimalist ceramic artist website focused on egg-shell porcelain and form-driven design."
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
