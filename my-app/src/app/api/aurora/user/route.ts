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
    console.log('[API POST /api/aurora/user] Creating new user with data:', body);
    const result = await createUser(body);
    console.log('[API POST /api/aurora/user] ✅ User created successfully:', result);
    return Response.json(result);
  } catch (error) {
    console.error('[API POST /api/aurora/user] ❌ Error creating user:', error);
    return Response.json({ message: 'Internal Server Error' });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const queryParams = url.searchParams;
    const id = queryParams.get('id');
    console.log('[API GET /api/aurora/user] Querying user with email:', id);
    if (!id) return Response.json({ message: 'Missing id' });
    const result = await getUser(id);
    if (result) {
      console.log('[API GET /api/aurora/user] ✅ User found:', result);
      return Response.json(result);
    }
    console.log('[API GET /api/aurora/user] ⚠️ User not found for email:', id);
    return Response.json(null);
  } catch (error) {
    console.error('[API GET /api/aurora/user] ❌ Error:', error);
    return Response.json({ message: 'Internal Server Error' });
  }
}
