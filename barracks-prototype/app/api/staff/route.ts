import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

type StaffMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  contactNumber: string;
  monthlySalary: number;
  createdAt: string;
};

type CreateStaffBody = {
  name?: string;
  role?: string;
  email?: string;
  contactNumber?: string;
  monthlySalary?: number | string;
};

const staffPath = path.join(process.cwd(), "app", "data", "staff.json");

const isStaffMember = (value: unknown): value is StaffMember => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const member = value as Record<string, unknown>;

  return (
    typeof member.id === "string" &&
    typeof member.name === "string" &&
    typeof member.role === "string" &&
    typeof member.email === "string" &&
    typeof member.contactNumber === "string" &&
    typeof member.monthlySalary === "number" &&
    typeof member.createdAt === "string"
  );
};

async function readStaffFile() {
  const fileContent = await fs.readFile(staffPath, "utf8");
  const parsed = JSON.parse(fileContent) as unknown;

  if (!Array.isArray(parsed) || !parsed.every(isStaffMember)) {
    throw new Error("Invalid staff data format.");
  }

  return parsed;
}

export async function GET() {
  try {
    const staff = await readStaffFile();
    return NextResponse.json(staff);
  } catch {
    return NextResponse.json({ message: "Could not load staff records." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: CreateStaffBody;

  try {
    body = (await request.json()) as CreateStaffBody;
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const role = body.role?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const contactNumber = body.contactNumber?.trim() ?? "";
  const monthlySalary = Number(body.monthlySalary);

  if (!name || !role || !email || !contactNumber || Number.isNaN(monthlySalary)) {
    return NextResponse.json({ message: "All fields are required." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  if (!/^[+()\-\d\s]{7,}$/.test(contactNumber)) {
    return NextResponse.json({ message: "Please enter a valid contact number." }, { status: 400 });
  }

  if (monthlySalary <= 0) {
    return NextResponse.json(
      { message: "Monthly salary must be a valid amount greater than 0." },
      { status: 400 }
    );
  }

  try {
    const staff = await readStaffFile();

    const newStaffMember: StaffMember = {
      id: `staff-${Date.now()}`,
      name,
      role,
      email,
      contactNumber,
      monthlySalary,
      createdAt: new Date().toISOString(),
    };

    const updatedStaff = [newStaffMember, ...staff];

    await fs.writeFile(staffPath, JSON.stringify(updatedStaff, null, 2), "utf8");

    return NextResponse.json(newStaffMember, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Could not save staff record." }, { status: 500 });
  }
}
