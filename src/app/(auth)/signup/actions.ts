"use server";
import { prisma } from "@/lib/prismaDB";
import { signUpSchema, SignUpSchemaType } from "@/lib/validations";
import { lucia } from "@/utils/auth";
import { hash } from "@node-rs/argon2"
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";



export async function signUp(credentaials: SignUpSchemaType): Promise<{error: string}> {
    try {
        // VALIDATE CREDENTIALS
        const { username, email, password } = signUpSchema.parse(credentaials);

        // HASH PASSWORD
        const hashedPassword = await hash(password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        // GENERATE USER ID
        const userId = generateIdFromEntropySize(10);

        // IF USERNAME ALREADY EXISTS
        const existingUser = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: "insensitive"
                }
            }
        });

        if (existingUser) {
            return { error: "Username already exists" };
        }

        // IF EMAIL ALREADY EXISTS
        const existingEmail = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: "insensitive"
                }
            }
        });

        if (existingEmail) {
            return { error: "Email already exists" };
        }

        // CREATE USER
        await prisma.user.create({
            data: {
                id: userId,
                username,
                name: username.split(" ")[0],
                email,
                password: hashedPassword
            }
        });

        // CREATE SESSION
        const session = await lucia.createSession(userId, {});

        // CREATE SESSION COOKIE
        const sessionCookie = lucia.createSessionCookie(session.id);

        // SET SESSION COOKIE
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        // REDIRECT TO HOME
        return redirect("/");
    }
    catch (error) {
        // HANDLE ERROR
        if (isRedirectError(error)) throw error;

        // LOG ERROR
        console.log(error);
        
        // RETURN ERROR
        return { error: "An unexpected error occurred. Please try again." };
    }
};