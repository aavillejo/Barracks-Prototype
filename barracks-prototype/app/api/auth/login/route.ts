import { NextResponse } from "next/server";

type LoginRequestBody = {
  username?: string;
  password?: string;
};

const DEMO_USERS = [
  {
    username: "admin",
    password: "barracks123",
  },
];

export async function POST(request: Request) {
  let body: LoginRequestBody;

  try {
    body = (await request.json()) as LoginRequestBody;
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }

  const username = body.username?.trim();
  const password = body.password;

  if (!username || !password) {
    return NextResponse.json(
      { message: "Username and password are required." },
      { status: 400 }
    );
  }

  const user = DEMO_USERS.find(
    (entry) => entry.username === username && entry.password === password
  );

  if (!user) {
    return NextResponse.json(
      { message: "Invalid username or password." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("barracks_auth", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
