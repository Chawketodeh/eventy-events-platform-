import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-col">
        <Header />
      <body>
        {children}
      </body>
      <Footer />
    </div>
  );
}
