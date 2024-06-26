import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/provider/StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Collaborative Whiteboard",
  description: "Real-Time Collaborative Whiteboard",
  keywords: ["collaborative", "whiteboard", "real-time"],
};

/**
 * Renders the root layout of the webpage.
 *
 * @param {React.ReactNode} children - The content to be rendered within the layout.
 * @return {JSX.Element} The JSX element representing the root layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
