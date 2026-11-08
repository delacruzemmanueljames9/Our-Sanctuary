import { NextRequest, NextResponse } from 'next/server';
import {
  getSanctuaryPlants,
  plantSanctuaryFlower,
  waterSanctuaryPlant,
  deleteSanctuaryPlant,
} from '@/lib/supabase/db';

export async function GET() {
  const plants = await getSanctuaryPlants();
  return NextResponse.json({ plants });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plantType, name, dedication, plantedBy, positionX, positionZ } = body;

    if (!name || !plantType || !plantedBy) {
      return NextResponse.json({ error: 'Name, plant type, and planter required.' }, { status: 400 });
    }

    const plant = await plantSanctuaryFlower({
      plantType,
      name,
      dedication: dedication || '',
      plantedBy: plantedBy === 'lei' ? 'lei' : 'emman',
      positionX: typeof positionX === 'number' ? positionX : (Math.random() - 0.5) * 6,
      positionZ: typeof positionZ === 'number' ? positionZ : (Math.random() - 0.5) * 6,
    });

    return NextResponse.json({ success: true, plant });
  } catch (error) {
    console.error('Garden plant error:', error);
    return NextResponse.json({ error: 'Failed to plant seed in garden.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: 'Plant ID required.' }, { status: 400 });

    const plant = await waterSanctuaryPlant(id);
    return NextResponse.json({ success: true, plant });
  } catch {
    return NextResponse.json({ error: 'Failed to water plant.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Plant ID required.' }, { status: 400 });

    await deleteSanctuaryPlant(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete plant.' }, { status: 500 });
  }
}
