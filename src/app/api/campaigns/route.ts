import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar todas las campañas
export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Error al obtener las campañas' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva campaña
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { 
      name, 
      utm_campaign, 
      utm_source, 
      utm_medium,
      utm_term,
      utm_content,
      active,
      startDate,
      endDate,
      description,
    } = body;

    // Validar campos requeridos
    if (!name || !utm_campaign || !utm_source || !utm_medium) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: name, utm_campaign, utm_source, utm_medium' },
        { status: 400 }
      );
    }

    // Verificar que utm_campaign sea único
    const existing = await prisma.campaign.findUnique({
      where: { utm_campaign },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una campaña con ese utm_campaign' },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        utm_campaign,
        utm_source,
        utm_medium,
        utm_term: utm_term || null,
        utm_content: utm_content || null,
        active: active !== undefined ? active : true,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        description: description || null,
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Error al crear la campaña' },
      { status: 500 }
    );
  }
}
