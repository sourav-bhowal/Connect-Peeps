"use server";
import { prisma } from "@/lib/prismaDB";
import { signInSchema, SignInSchemaType } from "@/lib/validations";
import { isRedirectError } from "next/dist/client/components/redirect";
import { verify } from "@node-rs/argon2"
import { lucia } from "@/utils/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";



export async function signIn(credentaials: SignInSchemaType): Promise<{error: string}> {
    try {
        // VALIDATE CREDENTIALS
        const { username, password } = signInSchema.parse(credentaials);

        // CHECK IF USER EXISTS
        const existingUser = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: "insensitive"
                }
            }
        });

        if (!existingUser || !existingUser.password) {
            return { error: "Invalid username or password" };
        }

        // CHECK IF PASSWORD IS CORRECT
        const isPasswordCorrect = await verify(existingUser.password, password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        if (!isPasswordCorrect) {
            return { error: "Invalid username or password" };
        }

        // CREATE SESSION
        const session = await lucia.createSession(existingUser.id, {});

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