import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "../globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://amarastour.com"),
  title: "Портал сотрудников | AMARAS TOUR",
  robots: { index: false, follow: false },
  icons: { icon: "/images/logo.png" },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body className="font-sans bg-[#141313] text-[#FCFCF7]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
