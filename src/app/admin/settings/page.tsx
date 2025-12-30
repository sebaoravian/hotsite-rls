'use client';

import { useState, useEffect } from 'react';
import { Globe, Shield, Search, Share2, Code } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Security
    sitePassword: '',
    sessionSecret: '',
    // SEO Settings
    siteName: '',
    siteTitle: '',
    siteDescription: '',
    siteKeywords: '',
    ogImage: '',
    twitterHandle: '',
    // Google Services
    googleAnalyticsId: '',
    googleSiteVerification: '',
    googleTagManagerId: '',
    // Social Media
    facebookAppId: '',
    linkedinUrl: '',
    instagramUrl: '',
    // Technical SEO
    canonicalUrl: '',
    locale: '',
    language: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Character counters
  const [titleLength, setTitleLength] = useState(0);
  const [descLength, setDescLength] = useState(0);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    setTitleLength(settings.siteTitle?.length || 0);
    setDescLength(settings.siteDescription?.length || 0);
  }, [settings.siteTitle, settings.siteDescription]);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage('Configuración guardada exitosamente.');
      } else {
        setMessage('Error al guardar la configuración');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Cargando configuración...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
        <p className="text-gray-600">Gestiona el SEO, integraciones y configuración del sitio</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('Error') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* SEO General */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">SEO General</h2>
              <p className="text-sm text-gray-600">Metadatos principales del sitio</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Sitio
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                placeholder="RotomLabs"
              />
              <p className="mt-1 text-xs text-gray-500">
                Aparece en el template del título
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título SEO Principal
              </label>
              <input
                type="text"
                maxLength={60}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                placeholder="RotomLabs — Digital Backbone"
              />
              <div className="mt-1 flex justify-between text-xs">
                <span className="text-gray-500">Recomendado: 50-60 caracteres</span>
                <span className={titleLength > 60 ? 'text-red-600 font-medium' : 'text-gray-500'}>
                  {titleLength}/60
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Sitio
              </label>
              <textarea
                maxLength={160}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                placeholder="RotomLabs builds the digital backbone behind global companies..."
              />
              <div className="mt-1 flex justify-between text-xs">
                <span className="text-gray-500">Recomendado: 150-160 caracteres</span>
                <span className={descLength > 160 ? 'text-red-600 font-medium' : 'text-gray-500'}>
                  {descLength}/160
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords (separadas por comas)
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={settings.siteKeywords || ''}
                onChange={(e) => setSettings({ ...settings, siteKeywords: e.target.value })}
                placeholder="cloud architecture, AI solutions, mobile platforms, data engineering"
              />
              <p className="mt-1 text-xs text-gray-500">
                Palabras clave principales del sitio
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen Open Graph por Defecto
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={settings.ogImage || ''}
                onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                placeholder="/og-image.png"
              />
              <p className="mt-1 text-xs text-gray-500">
                Tamaño recomendado: 1200x630 píxeles. Se usa cuando no hay imagen específica.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Canónica
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={settings.canonicalUrl}
                onChange={(e) => setSettings({ ...settings, canonicalUrl: e.target.value })}
                placeholder="https://rotom-labs.com"
              />
              <p className="mt-1 text-xs text-gray-500">
                URL principal del sitio (sin trailing slash)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Locale
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={settings.locale}
                  onChange={(e) => setSettings({ ...settings, locale: e.target.value })}
                  placeholder="en_US"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idioma
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  placeholder="en"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Google Services */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Google Services</h2>
              <p className="text-sm text-gray-600">Analytics, Search Console y Tag Manager</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Analytics ID
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={settings.googleAnalyticsId || ''}
                onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                placeholder="G-XXXXXXXXXX"
              />
              <p className="mt-1 text-xs text-gray-500">
                Formato: G-XXXXXXXXXX para Google Analytics 4
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Site Verification
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={settings.googleSiteVerification || ''}
                onChange={(e) => setSettings({ ...settings, googleSiteVerification: e.target.value })}
                placeholder="código de verificación"
              />
              <p className="mt-1 text-xs text-gray-500">
                Para Google Search Console (solo el código, sin la etiqueta meta)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Tag Manager ID
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={settings.googleTagManagerId || ''}
                onChange={(e) => setSettings({ ...settings, googleTagManagerId: e.target.value })}
                placeholder="GTM-XXXXXXX"
              />
              <p className="mt-1 text-xs text-gray-500">
                Formato: GTM-XXXXXXX (opcional)
              </p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Share2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Redes Sociales</h2>
              <p className="text-sm text-gray-600">Configuración de plataformas sociales</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Handle
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={settings.twitterHandle}
                onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })}
                placeholder="@rotom_labs"
              />
              <p className="mt-1 text-xs text-gray-500">
                Incluye el @ (para Twitter Cards)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook App ID
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={settings.facebookAppId || ''}
                onChange={(e) => setSettings({ ...settings, facebookAppId: e.target.value })}
                placeholder="123456789"
              />
              <p className="mt-1 text-xs text-gray-500">
                Solo si usas Facebook SDK (opcional)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn URL
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={settings.linkedinUrl}
                onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/company/rotomlabs"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram URL
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/rotom_labs"
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Seguridad</h2>
              <p className="text-sm text-gray-600">Contraseñas y claves secretas</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña del Sitio
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={settings.sitePassword}
                onChange={(e) => setSettings({ ...settings, sitePassword: e.target.value })}
                placeholder="rotomlabs2024"
              />
              <p className="mt-1 text-xs text-gray-500">
                Contraseña para acceder al sitio principal
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Secret
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
                value={settings.sessionSecret}
                onChange={(e) => setSettings({ ...settings, sessionSecret: e.target.value })}
                placeholder="your-secret-key-change-this-in-production"
              />
              <p className="mt-1 text-xs text-gray-500">
                Clave secreta para las sesiones. Usa una clave fuerte en producción.
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Importante:</strong> Los cambios de seguridad (contraseña/session) 
                requieren reinicio del servidor.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Información Técnica</h2>
              <p className="text-sm text-gray-600">Cómo se almacenan las configuraciones</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>Configuraciones SEO y Sociales:</strong> Se guardan en la base de datos y se aplican inmediatamente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>Configuraciones de Seguridad:</strong> Se guardan en el archivo .env y requieren reiniciar el servidor</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>Google Verification:</strong> Se inyecta automáticamente en el meta tag del layout</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </button>
          <button
            type="button"
            onClick={loadSettings}
            className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Restaurar
          </button>
        </div>
      </form>
    </div>
  );
}
