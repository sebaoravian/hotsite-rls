import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

const ENV_PATH = path.join(process.cwd(), '.env');

// GET - Leer configuraciones actuales (base de datos + .env)
export async function GET() {
  try {
    // Obtener configuración SEO de la base de datos
    let siteSettings = await prisma.siteSettings.findFirst();
    
    // Si no existe, crear con valores por defecto
    if (!siteSettings) {
      siteSettings = await prisma.siteSettings.create({
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

    // Configuraciones críticas de .env
    const envSettings = {
      sitePassword: process.env.SITE_PASSWORD || '',
      sessionSecret: process.env.SESSION_SECRET || '',
    };

    return NextResponse.json({
      ...siteSettings,
      ...envSettings,
    });
  } catch (error) {
    console.error('Error reading settings:', error);
    return NextResponse.json(
      { error: 'Error al leer la configuración' },
      { status: 500 }
    );
  }
}

// POST - Guardar configuraciones
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      sitePassword, 
      sessionSecret,
      // SEO Settings
      siteName,
      siteTitle,
      siteDescription,
      siteKeywords,
      ogImage,
      twitterHandle,
      googleAnalyticsId,
      googleSiteVerification,
      googleTagManagerId,
      facebookAppId,
      linkedinUrl,
      instagramUrl,
      canonicalUrl,
      locale,
      language,
    } = body;

    // Actualizar configuraciones de base de datos
    const siteSettingsData: any = {};
    if (siteName !== undefined) siteSettingsData.siteName = siteName;
    if (siteTitle !== undefined) siteSettingsData.siteTitle = siteTitle;
    if (siteDescription !== undefined) siteSettingsData.siteDescription = siteDescription;
    if (siteKeywords !== undefined) siteSettingsData.siteKeywords = siteKeywords || null;
    if (ogImage !== undefined) siteSettingsData.ogImage = ogImage || null;
    if (twitterHandle !== undefined) siteSettingsData.twitterHandle = twitterHandle;
    if (googleAnalyticsId !== undefined) siteSettingsData.googleAnalyticsId = googleAnalyticsId || null;
    if (googleSiteVerification !== undefined) siteSettingsData.googleSiteVerification = googleSiteVerification || null;
    if (googleTagManagerId !== undefined) siteSettingsData.googleTagManagerId = googleTagManagerId || null;
    if (facebookAppId !== undefined) siteSettingsData.facebookAppId = facebookAppId || null;
    if (linkedinUrl !== undefined) siteSettingsData.linkedinUrl = linkedinUrl;
    if (instagramUrl !== undefined) siteSettingsData.instagramUrl = instagramUrl;
    if (canonicalUrl !== undefined) siteSettingsData.canonicalUrl = canonicalUrl;
    if (locale !== undefined) siteSettingsData.locale = locale;
    if (language !== undefined) siteSettingsData.language = language;

    if (Object.keys(siteSettingsData).length > 0) {
      const existingSettings = await prisma.siteSettings.findFirst();
      
      if (existingSettings) {
        await prisma.siteSettings.update({
          where: { id: existingSettings.id },
          data: siteSettingsData,
        });
      } else {
        await prisma.siteSettings.create({
          data: siteSettingsData,
        });
      }
    }

    // Actualizar .env para configuraciones críticas
    if (sitePassword !== undefined || sessionSecret !== undefined) {
      let envContent = fs.existsSync(ENV_PATH) 
        ? fs.readFileSync(ENV_PATH, 'utf-8')
        : '';

      const updateEnvVar = (content: string, key: string, value: string) => {
        const regex = new RegExp(`^${key}=.*$`, 'm');
        if (regex.test(content)) {
          return content.replace(regex, `${key}="${value}"`);
        } else {
          return content + `\n${key}="${value}"`;
        }
      };

      if (sitePassword !== undefined) {
        envContent = updateEnvVar(envContent, 'SITE_PASSWORD', sitePassword);
      }
      if (sessionSecret !== undefined) {
        envContent = updateEnvVar(envContent, 'SESSION_SECRET', sessionSecret);
      }

      // Asegurar que DATABASE_URL exista
      if (!envContent.includes('DATABASE_URL=')) {
        envContent = 'DATABASE_URL="file:./dev.db"\n' + envContent;
      }

      fs.writeFileSync(ENV_PATH, envContent.trim() + '\n');
    }

    return NextResponse.json({ 
      success: true,
      message: 'Configuración guardada exitosamente' 
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Error al guardar la configuración' },
      { status: 500 }
    );
  }
}
