import { Poppins } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/store/ReduxProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
        className={`${poppins.variable} antialiased font-sans`}
      >
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
