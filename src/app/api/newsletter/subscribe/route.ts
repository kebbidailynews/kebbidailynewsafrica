export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ message: "Email is required" }, { status: 400 });
    }

    const API_KEY = process.env.MAILERLITE_API_KEY;

    if (!API_KEY) {
      return Response.json({ message: "Server misconfigured" }, { status: 500 });
    }

    const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        email,
        status: "active",
        groups: ["186309433693832650"], // 👈 Added your Group ID
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { message: data?.message || "Subscription failed" },
        { status: 400 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}