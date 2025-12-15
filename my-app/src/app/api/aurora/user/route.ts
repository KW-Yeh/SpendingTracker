import { createUser, getUser, putUser } from '@/services/user';

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const result = putUser(body.user_id, body);
    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal Server Error' });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = createUser(body);
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
    if (!id) return Response.json({ message: 'Missing id' });
    const result = await getUser(id);
    if (result) return Response.json(result);
    return Response.json({ message: 'User not found' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal Server Error' });
  }
}
