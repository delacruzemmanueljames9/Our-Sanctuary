import { NextRequest, NextResponse } from 'next/server';
import {
  getSanctuaryMemories,
  getSanctuaryAlbums,
  addSanctuaryMemory,
  deleteSanctuaryMemory,
} from '@/lib/supabase/db';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const albumId = url.searchParams.get('albumId');
  const memories = await getSanctuaryMemories(albumId || undefined);
  const albums = await getSanctuaryAlbums();
  return NextResponse.json({ memories, albums });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, mediaUrl, mediaType, memoryDate, location, tags, isFavorite, uploadedBy, albumId } = body;

    if (!title || !mediaUrl) {
      return NextResponse.json({ error: 'Title and Media URL are required.' }, { status: 400 });
    }

    const memory = await addSanctuaryMemory({
      title: title.trim(),
      description: description || '',
      mediaUrl,
      mediaType: mediaType || 'image',
      memoryDate: memoryDate || new Date().toISOString().split('T')[0],
      location: location || '',
      tags: tags || [],
      isFavorite: Boolean(isFavorite),
      uploadedBy: uploadedBy === 'lei' ? 'lei' : 'emman',
      albumId: albumId || null,
    });

    return NextResponse.json({ success: true, memory });
  } catch (error) {
    console.error('Add memory error:', error);
    return NextResponse.json({ error: 'Failed to preserve memory.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Memory ID required.' }, { status: 400 });

    await deleteSanctuaryMemory(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete memory.' }, { status: 500 });
  }
}
