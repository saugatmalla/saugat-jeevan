import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json(); // Parse the request body as JSON
        const { email, firstName, lastName, phoneNumber } = body;

        if (!email || !firstName || !lastName || !phoneNumber) {
            return new Response(
                JSON.stringify({ message: 'All fields are required.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if email or phone number already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phoneNumber },
                ],
            },
        });

        if (existingUser) {
            return new Response(
                JSON.stringify({ message: 'Email or phone number already exists.' }),
                { status: 409, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const user = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                phoneNumber,
            },
        });

        return new Response(
            JSON.stringify({ message: 'User registered successfully.', user }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error: any) {
        return new Response(
            JSON.stringify({ message: 'Internal Server Error', error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
