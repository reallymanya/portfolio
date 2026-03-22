import { Nunito, Syne, Dancing_Script } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Manya Takkar — Creative Developer",
  description: "A creative developer portfolio with scroll-driven animations and 3D interactions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${syne.variable} ${dancingScript.variable} font-sans antialiased text-gray-800 bg-[#FFFDF5]`}>
        {children}
      </body>
    </html>
  );
}
