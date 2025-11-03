import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/lib/providers/SessionProvider";
import { RecoilProvider } from "@/lib/store/RecoilProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NodeFlow - Visual Workflow Management",
  description:
    "Design, visualize, and manage your project workflows with our intuitive drag-and-drop interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <RecoilProvider>
            <ThemeProvider defaultTheme="light" storageKey="nodeflow-ui-theme">
              {children}
            </ThemeProvider>
          </RecoilProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
