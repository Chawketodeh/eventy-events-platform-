import type { Metadata } from "next";
import { Geist, Geist_Mono,Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400","500","600", "700"],
  variable: "--font-poppins",
});



export const metadata: Metadata = {
  title: "Eventy",
  description: "Eventy - Event Management Platform",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${poppins.variable} bg-white font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}
