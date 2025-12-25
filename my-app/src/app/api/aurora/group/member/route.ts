import { addGroupMember, removeGroupMember } from '@/services/group';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await addGroupMember(body);
    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const accountId = url.searchParams.get('account_id');
    const userId = url.searchParams.get('user_id');

    if (!accountId || !userId) {
      return Response.json(
        { message: '缺少帳本 ID 或使用者 ID' },
        { status: 400 },
      );
    }

    const result = await removeGroupMember(Number(accountId), Number(userId));
    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
