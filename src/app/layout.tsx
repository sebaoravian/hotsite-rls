import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import { OrganizationSchema, WebsiteSchema } from "@/components/StructuredData";
import { prisma } from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"] });

async function getSettings() {
  try {
    let settings = await prisma.siteSettings.findFirst();
    
    if (!settings) {
      // Crear settings por defecto si no existen
      settings = await prisma.siteSettings.create({
        data: {
          siteName: "RotomLabs",
          siteTitle: "RotomLabs — Digital Backbone",
          siteDescription: "RotomLabs builds the digital backbone behind global companies: cloud architecture, data, AI, mobile platforms and secure integrations.",
          twitterHandle: "@rotom_labs",
          linkedinUrl: "https://linkedin.com/company/rotomlabs",
          instagramUrl: "https://instagram.com/rotom_labs",
          canonicalUrl: "https://rotom-labs.com",
          locale: "en_US",
          language: "en",
        },
      });
    }
    
    return settings;
  } catch (error) {
    console.error('Error loading settings:', error);
    // Retornar valores por defecto si hay error
    return {
      siteName: "RotomLabs",
      siteTitle: "RotomLabs — Digital Backbone",
      siteDescription: "RotomLabs builds the digital backbone behind global companies: cloud architecture, data, AI, mobile platforms and secure integrations.",
      siteKeywords: null,
      ogImage: null,
      twitterHandle: "@rotom_labs",
      googleAnalyticsId: null,
      googleSiteVerification: null,
      canonicalUrl: "https://rotom-labs.com",
      locale: "en_US",
      language: "en",
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  
  // Procesar keywords
  const keywordsArray = settings.siteKeywords 
    ? settings.siteKeywords.split(',').map(k => k.trim())
    : ["cloud architecture", "data engineering", "AI development", "mobile platforms", "secure integrations", "digital transformation", "backend development", "API development", "microservices"];
  
  // Imagen por defecto
  const defaultImage = settings.ogImage || '/logo.png';
  
  return {
    title: {
      default: settings.siteTitle,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.siteDescription,
    keywords: keywordsArray,
    authors: [{ name: settings.siteName }],
    creator: settings.siteName,
    publisher: settings.siteName,
    metadataBase: new URL(settings.canonicalUrl),
    alternates: {
      canonical: '/',
    },
    icons: {
      icon: '/favicon.svg',
      apple: '/favicon.svg',
    },
    openGraph: {
      title: settings.siteTitle,
      description: settings.siteDescription,
      url: settings.canonicalUrl,
      siteName: settings.siteName,
      locale: settings.locale,
      type: 'website',
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: settings.siteTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.siteTitle,
      description: settings.siteDescription,
      creator: settings.twitterHandle,
      images: [defaultImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: settings.googleSiteVerification || undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const GA_ID = settings.googleAnalyticsId || process.env.NEXT_PUBLIC_GA_ID;
  const GTM_ID = settings.googleTagManagerId;
  
  return (
    <html lang={settings.language} className="scroll-smooth">
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        {GTM_ID && (
          <>
            <Script id="google-tag-manager" strategy="afterInteractive">
              {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.className} antialiased`}>
        {GTM_ID && (
          <noscript>
            <iframe 
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0" 
              width="0" 
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <OrganizationSchema />
        <WebsiteSchema />
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}
