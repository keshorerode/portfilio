import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Load Inter font for non-Apple devices
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "KESHORE",
    template: "%s | KESHORE VENKATACHALAM MURUGESAN"
  },
  description: "Professional portfolio of Keshore Venkatachalam Murugesan",
  keywords: [
    "Keshore Venkatachalam Murugesan",
    "Full-stack Developer",
    "Python Developer",
    "AI Engineer",
    "Portfolio",
    "Software Developer",
    "Machine Learning",
    "IoT Developer",
    "Web Development",
    "Next.js",
    "React",
    "FastAPI",
    "Django",
    "Automation",
    "LangChain",
    "Smart India Hackathon",
    "Freelancer",
    "AI Chatbot",
    "Professional Portfolio",
    "Developer Portfolio",
    "Tech Portfolio",
    "Internship",
    "Python Automation",
    "Web Scraping",
    "API Development"
  ],
  authors: [
    {
      name: "Keshore Venkatachalam Murugesan",
      url: "https://portfolio.keshore.com/",
    },
  ],
  creator: "Keshore Venkatachalam Murugesan",
  publisher: "Keshore Venkatachalam Murugesan",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portfolio.keshore.com/",
    title: "KESHORE",
    description: "Professional portfolio of Keshore Venkatachalam Murugesan - Software Engineer.",
    siteName: "Keshore Venkatachalam Murugesan Portfolio",
    images: [
      {
        url: "https://portfolio.anujjainbatu.tech/portfolio.png",
        width: 1200,
        height: 630,
        alt: "Keshore Venkatachalam Murugesan - Professional Portfolio with AI Chatbot",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KESHORE",
    description: "Professional portfolio of Keshore Venkatachalam Murugesan.",
    creator: "@keshorevm",
    site: "@keshorevm",
    images: [{
      url: "https://portfolio.anujjainbatu.tech/portfolio.png",
      alt: "Keshore Venkatachalam Murugesan Professional Portfolio"
    }],
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      }
    ],
    shortcut: "/favicon.ico?v=2",
    apple: "/apple-touch-icon.svg?v=2",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://portfolio.anujjainbatu.tech/",
  },
  category: "technology",
  classification: "Portfolio Website",
  other: {
    "google-site-verification": "your-google-verification-code-here",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href="https://portfolio.anujjainbatu.tech/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Keshore Venkatachalam Murugesan",
              "jobTitle": "Software Engineer",
              "url": "https://portfolio.keshorevm.com/",
              "image": "",
              "sameAs": [
                "https://github.com/keshorevm",
                "https://linkedin.com/in/keshorevm",
                "https://x.com/keshorevm"
              ],
              "worksFor": {
                "@type": "Organization",
                "name": "Freelance"
              },
              "alumniOf": {
                "@type": "Organization",
                "name": "SATI"
              },
              "knowsAbout": [
                "Python Development",
                "AI Engineering",
                "Machine Learning",
                "IoT Systems",
                "Web Development",
                "Automation",
                "Full Stack Development"
              ],
              "description": "Full-stack Python Developer & AI Engineer with expertise in building AI-powered solutions, IoT systems, and automation tools. SIH 2025 Finalist with 25+ delivered projects."
            })
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
        >
          <main className="flex min-h-screen flex-col">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}