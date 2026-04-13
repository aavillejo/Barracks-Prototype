import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

type Customer = {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  createdAt: string;
};

type CreateCustomerBody = {
  name?: string;
  email?: string;
  contactNumber?: string;
};

const customersPath = path.join(process.cwd(), "app", "data", "customers.json");

const isCustomer = (value: unknown): value is Customer => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const customer = value as Record<string, unknown>;

  return (
    typeof customer.id === "string" &&
    typeof customer.name === "string" &&
    typeof customer.email === "string" &&
    typeof customer.contactNumber === "string" &&
    typeof customer.createdAt === "string"
  );
};

async function readCustomersFile() {
  const fileContent = await fs.readFile(customersPath, "utf8");
  const parsed = JSON.parse(fileContent) as unknown;

  if (!Array.isArray(parsed) || !parsed.every(isCustomer)) {
    throw new Error("Invalid customers data format.");
  }

  return parsed;
}

export async function GET() {
  try {
    const customers = await readCustomersFile();
    return NextResponse.json(customers);
  } catch {
    return NextResponse.json({ message: "Could not load customers." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: CreateCustomerBody;

  try {
    body = (await request.json()) as CreateCustomerBody;
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const contactNumber = body.contactNumber?.trim() ?? "";

  if (!name || !email || !contactNumber) {
    return NextResponse.json(
      { message: "Name, email, and contact number are required." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  if (!/^[+()\-\d\s]{7,}$/.test(contactNumber)) {
    return NextResponse.json({ message: "Please enter a valid contact number." }, { status: 400 });
  }

  try {
    const customers = await readCustomersFile();

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name,
      email,
      contactNumber,
      createdAt: new Date().toISOString(),
    };

    const updatedCustomers = [newCustomer, ...customers];

    await fs.writeFile(customersPath, JSON.stringify(updatedCustomers, null, 2), "utf8");

    return NextResponse.json(newCustomer, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Could not save customer." }, { status: 500 });
  }
}
