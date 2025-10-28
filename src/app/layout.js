import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/store/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Stilify – Mode på dina villkor",
  description:
    "Snart lanseras Stilify – sök med bild, jämför nytt och second hand och hitta din personliga stil.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
