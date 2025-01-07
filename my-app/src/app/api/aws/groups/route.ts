export async function PUT(req: Request) {
  try {
    const body = await req.json();
    return fetch(`${process.env.AWS_API_GATEWAY_URL}/groups`, {
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
    const ids = queryParams.get('ids');
    if (id) {
      return fetch(`${process.env.AWS_API_GATEWAY_URL}/groups/${id}`, {
        method: 'GET',
      });
    }
    const data = await fetch(`${process.env.AWS_API_GATEWAY_URL}/groups`, {
      method: 'GET',
    }).then((res) => res.json());
    if (ids) {
      const idList = JSON.parse(ids) as string[];
      return Response.json(
        data.filter((group: Group) => idList.includes(group.id)),
      );
    }
    return Response.json(data);
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
    return fetch(`${process.env.AWS_API_GATEWAY_URL}/groups/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal Server Error' });
  }
}
