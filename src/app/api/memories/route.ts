import { NextRequest, NextResponse } from 'next/server';
import { sanctuaryStore } from '@/lib/supabase/mock-store';
import { verifyIsAdmin } from '@/lib/auth/tokens';

export async function GET() {
  const memories = sanctuaryStore.getMemories();
  const albums = sanctuaryStore.getAlbums();
  return NextResponse.json({ memories, albums });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, mediaUrl, mediaType, memoryDate, location, tags, isFavorite, uploadedBy, albumId } = body;

    if (!title || !mediaUrl) {
      return NextResponse.json({ error: 'Title and media URL are required.' }, { status: 400 });
    }

    const memory = sanctuaryStore.addMemory({
      albumId,
      title,
      description: description || '',
      mediaUrl,
      mediaType: mediaType || 'image',
      memoryDate: memoryDate || new Date().toISOString().split('T')[0],
      location: location || '',
      tags: Array.isArray(tags) ? tags : [],
      isFavorite: Boolean(isFavorite),
      uploadedBy: uploadedBy === 'lei' ? 'lei' : 'emman',
    });

    return NextResponse.json({ success: true, memory });
  } catch (error) {
    console.error('Add memory error:', error);
    return NextResponse.json({ error: 'Failed to preserve memory.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const adminToken = req.cookies.get('sanctuary_admin_token')?.value;
  const isAdmin = await verifyIsAdmin(adminToken);

  if (!isAdmin) {
    return NextResponse.json({ error: 'Only Super Administrator Emman can delete memories.' }, { status: 403 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Memory ID required.' }, { status: 400 });

  sanctuaryStore.deleteMemory(id);
  return NextResponse.json({ success: true });
}
