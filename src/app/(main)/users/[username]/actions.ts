"use server";
import { prisma } from "@/lib/prismaDB";
import { updateUserSchema, UpdateUserSchemaType } from "@/lib/validations";
import { validateRequest } from "@/utils/auth";
import { getUserData } from "@/utils/types";


// UPDATE USER PROFILE
export async function updateUserProfile(values: UpdateUserSchemaType) {
    // validate values
    const validatedValues = updateUserSchema.parse(values);

    // user from session
    const { user } = await validateRequest();

    // if no user
    if (!user) throw new Error("Unauthorized.");

    // update user
    const updatedUser = await prisma.user.update({
        where: {
            id: user.id,
        },
        data: validatedValues,
        select: getUserData(user.id),
    });

    // return updated user data to client
    return updatedUser;
}