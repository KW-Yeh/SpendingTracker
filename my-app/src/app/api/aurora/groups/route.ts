import {
  createGroup,
  deleteGroup,
  getUserOwnedGroups,
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
    const result = await getUserOwnedGroups(Number(id));
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
