import { getBudget, putBudget, deleteBudget } from '@/services/budget';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const accountId = url.searchParams.get('account_id');

    if (!accountId) {
      return Response.json({ message: '缺少帳本 ID' }, { status: 400 });
    }

    const data = await getBudget(Number(accountId));
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
    const result = await putBudget(body);
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

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const accountId = url.searchParams.get('account_id');

    if (!accountId) {
      return Response.json({ message: '缺少帳本 ID' }, { status: 400 });
    }

    const result = await deleteBudget(Number(accountId));
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
