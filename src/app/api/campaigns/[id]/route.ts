import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = Promise<{ id: string }>;

// GET - Obtener una campaña específica
export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    
    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaña no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { error: 'Error al obtener la campaña' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar una campaña
export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
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

    // Verificar que utm_campaign sea único (excepto para esta campaña)
    if (utm_campaign) {
      const existing = await prisma.campaign.findFirst({
        where: {
          utm_campaign,
          id: { not: id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'Ya existe otra campaña con ese utm_campaign' },
          { status: 400 }
        );
      }
    }

    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(utm_campaign && { utm_campaign }),
        ...(utm_source && { utm_source }),
        ...(utm_medium && { utm_medium }),
        utm_term: utm_term || null,
        utm_content: utm_content || null,
        active: active !== undefined ? active : undefined,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        description: description || null,
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la campaña' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una campaña
export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    
    await prisma.campaign.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Campaña eliminada' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la campaña' },
      { status: 500 }
    );
  }
}
