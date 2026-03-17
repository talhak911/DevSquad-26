import { NextResponse } from 'next/server';
import data from '@/data/jobs.json';

export async function GET() {
  return NextResponse.json(data);
}
