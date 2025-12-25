import {
  getFavoriteCategories,
  putFavoriteCategories,
} from '@/services/favoriteCategories';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const ownerId = url.searchParams.get('owner_id');

    if (!ownerId) {
      return Response.json({ message: '缺少使用者 ID' }, { status: 400 });
    }

    const data = await getFavoriteCategories(Number(ownerId));
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        status: false,
        message:
          error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const result = await putFavoriteCategories(body);
    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        status: false,
        message:
          error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 },
    );
  }
}
