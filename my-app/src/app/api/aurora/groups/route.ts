import {
  createGroup,
  deleteGroup,
  getUserGroups,
  getGroupById,
  updateGroup,
} from '@/services/group';

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const result = await updateGroup(body.account_id, body);
    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal Server Error' });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createGroup(body);
    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal Server Error' });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const queryParams = url.searchParams;
    const id = queryParams.get('id');
    const type = queryParams.get('type'); // 'owned' 或 'single'

    if (!id) {
      return Response.json(
        { message: '缺少 ID 參數' },
        { status: 400 }
      );
    }

    let result;
    if (type === 'single') {
      // 查詢單個群組（用於邀請連結）
      const group = await getGroupById(Number(id));
      result = group ? [group] : [];
    } else {
      // 預設：查詢用戶參與的所有群組（包括擁有的和被邀請的）
      result = await getUserGroups(Number(id));
    }

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal Server Error' });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const queryParams = url.searchParams;
    const id = queryParams.get('id');
    const result = await deleteGroup(Number(id));
    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal Server Error' });
  }
}
