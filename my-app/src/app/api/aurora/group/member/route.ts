import { addGroupMember } from '@/services/group';

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
