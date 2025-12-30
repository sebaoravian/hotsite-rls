'use client';

import { useState, useEffect } from 'react';

interface Campaign {
  id: string;
  name: string;
  utm_campaign: string;
  utm_source: string;
  utm_medium: string;
  utm_term?: string;
  utm_content?: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
  description?: string;
  createdAt: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState('https://rotom-labs.com');
  
  const [formData, setFormData] = useState({
    name: '',
    utm_campaign: '',
    utm_source: '',
    utm_medium: '',
    utm_term: '',
    utm_content: '',
    active: true,
    startDate: '',
    endDate: '',
    description: '',
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateUrl = (campaign: Campaign) => {
    const params = new URLSearchParams({
      utm_campaign: campaign.utm_campaign,
      utm_source: campaign.utm_source,
      utm_medium: campaign.utm_medium,
    });

    if (campaign.utm_term) {
      params.append('utm_term', campaign.utm_term);
    }
    if (campaign.utm_content) {
      params.append('utm_content', campaign.utm_content);
    }

    return `${baseUrl}?${params.toString()}`;
  };

  const copyUrl = (campaign: Campaign) => {
    const url = generateUrl(campaign);
    navigator.clipboard.writeText(url);
    alert('URL copiada al portapapeles');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingId ? `/api/campaigns/${editingId}` : '/api/campaigns';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchCampaigns();
        resetForm();
      } else {
        const error = await res.json();
        alert(error.error || 'Error al guardar la campaña');
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
      alert('Error al guardar la campaña');
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setFormData({
      name: campaign.name,
      utm_campaign: campaign.utm_campaign,
      utm_source: campaign.utm_source,
      utm_medium: campaign.utm_medium,
      utm_term: campaign.utm_term || '',
      utm_content: campaign.utm_content || '',
      active: campaign.active,
      startDate: campaign.startDate ? campaign.startDate.split('T')[0] : '',
      endDate: campaign.endDate ? campaign.endDate.split('T')[0] : '',
      description: campaign.description || '',
    });
    setEditingId(campaign.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta campaña?')) return;

    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchCampaigns();
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      utm_campaign: '',
      utm_source: '',
      utm_medium: '',
      utm_term: '',
      utm_content: '',
      active: true,
      startDate: '',
      endDate: '',
      description: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Campañas</h1>
          <p className="text-gray-600">Crea y gestiona campañas de marketing con parámetros UTM</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          {showForm ? 'Cancelar' : '+ Nueva Campaña'}
        </button>
      </div>

      {/* Campo para URL Base */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-blue-900 mb-2">
          URL Base para generar links:
        </label>
        <input
          type="url"
          className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="https://rotom-labs.com"
        />
        <p className="text-sm text-blue-700 mt-2">
          Esta URL se usará para generar los links de las campañas
        </p>
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 mb-8 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {editingId ? 'Editar Campaña' : 'Nueva Campaña'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Nombre de la Campaña *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Campaña Verano 2024"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">utm_campaign *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.utm_campaign}
                onChange={(e) => setFormData({ ...formData, utm_campaign: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                placeholder="verano_2024"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">utm_source *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.utm_source}
                onChange={(e) => setFormData({ ...formData, utm_source: e.target.value })}
                placeholder="facebook, google, email, etc."
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">utm_medium *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.utm_medium}
                onChange={(e) => setFormData({ ...formData, utm_medium: e.target.value })}
                placeholder="cpc, banner, newsletter, etc."
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">utm_term (opcional)</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.utm_term}
                onChange={(e) => setFormData({ ...formData, utm_term: e.target.value })}
                placeholder="keywords para búsqueda"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">utm_content (opcional)</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.utm_content}
                onChange={(e) => setFormData({ ...formData, utm_content: e.target.value })}
                placeholder="variante del anuncio"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Fecha de Inicio</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Fecha de Fin</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción de la campaña..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
                Campaña Activa
              </label>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              {editingId ? 'Actualizar' : 'Crear'} Campaña
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de Campañas */}
      <div className="space-y-4">
        {campaigns.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay campañas creadas</h3>
            <p className="text-gray-600 mb-4">Crea tu primera campaña para empezar a trackear tus fuentes de tráfico</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              + Nueva Campaña
            </button>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      campaign.active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {campaign.active ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  {campaign.description && (
                    <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                  )}
                  
                  {/* Parámetros UTM */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-mono">
                      utm_campaign={campaign.utm_campaign}
                    </span>
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full font-mono">
                      utm_source={campaign.utm_source}
                    </span>
                    <span className="px-3 py-1 bg-pink-50 text-pink-700 text-xs rounded-full font-mono">
                      utm_medium={campaign.utm_medium}
                    </span>
                    {campaign.utm_term && (
                      <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs rounded-full font-mono">
                        utm_term={campaign.utm_term}
                      </span>
                    )}
                    {campaign.utm_content && (
                      <span className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-mono">
                        utm_content={campaign.utm_content}
                      </span>
                    )}
                  </div>

                  {/* URL Generada */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-medium text-gray-600 uppercase">URL de Campaña</label>
                      <button
                        onClick={() => copyUrl(campaign)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors font-medium"
                      >
                        📋 Copiar URL
                      </button>
                    </div>
                    <div className="bg-white p-2 rounded border border-gray-200 break-all text-sm font-mono text-gray-700">
                      {generateUrl(campaign)}
                    </div>
                  </div>

                  {/* Fechas */}
                  {(campaign.startDate || campaign.endDate) && (
                    <div className="mt-3 text-sm text-gray-500">
                      {campaign.startDate && (
                        <span>Inicio: {new Date(campaign.startDate).toLocaleDateString()}</span>
                      )}
                      {campaign.startDate && campaign.endDate && <span> • </span>}
                      {campaign.endDate && (
                        <span>Fin: {new Date(campaign.endDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(campaign)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors font-medium"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(campaign.id)}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm transition-colors font-medium"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
