export async function PUT(req: Request) {
  try {
    const body = await req.json();
    return await fetch(`${process.env.AWS_API_GATEWAY_URL}/groups`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
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
    if (id) {
      return await fetch(`${process.env.AWS_API_GATEWAY_URL}/groups/${id}`, {
        method: 'GET',
      });
    }
    return await fetch(`${process.env.AWS_API_GATEWAY_URL}/groups`, {
      method: 'GET',
    });
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
    return await fetch(`${process.env.AWS_API_GATEWAY_URL}/groups/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal Server Error' });
  }
}
