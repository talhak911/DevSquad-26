import { NextResponse } from 'next/server';
import { carouselGames, freeGames, highlights, gameLists } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  // Artificial delay between 500ms and 1500ms to simulate realism
  const delay = Math.floor(Math.random() * 1000) + 500;
  await new Promise((resolve) => setTimeout(resolve, delay));

  switch (type) {
    case 'carousel':
      return NextResponse.json(carouselGames);
    case 'free':
      return NextResponse.json(freeGames);
    case 'highlights':
      return NextResponse.json(highlights);
    case 'lists':
      return NextResponse.json(gameLists);
    default:
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }
}
