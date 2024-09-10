import type { Metadata } from "next"; // Mengimpor tipe Metadata dari Next.js
import localFont from "next/font/local"; // Mengimpor fungsi localFont dari Next.js
import "./globals.css"; // Mengimpor stylesheet global
import { ThemeProvider } from "@/app/components/dashboard/ThemeProvide"; // Mengimpor ThemeProvider dari path yang ditentukan
import { Toaster } from "@/components/ui/sonner"; // Mengimpor Toaster dari path yang ditentukan

// Mendefinisikan font lokal GeistSans
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

// Mendefinisikan font lokal GeistMono
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

// Mendefinisikan metadata untuk aplikasi
export const metadata: Metadata = {
  title: "Blog Van",
  description: "Blog Van",
};

// Komponen RootLayout yang membungkus seluruh aplikasi
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {" "}
      {/* Menentukan bahasa dokumen */}
      <body className={`${geistSans.className} ${geistMono.className}`}>
        {" "}
        {/* Menambahkan kelas font ke elemen body */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children} {/* Menyertakan children yang diteruskan ke RootLayout */}
        </ThemeProvider>
        <Toaster richColors closeButton /> {/* Menambahkan komponen Toaster */}
      </body>
    </html>
  );
}
