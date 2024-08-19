"use server";
import { prisma } from "@/lib/prismaDB";
import streamServer from "@/lib/stream";
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

  // Prisma transaction
  const updatedUser = await prisma.$transaction(async (tx) => {
    // update user
    const updatedUser = await tx.user.update({
      where: {
        id: user.id,
      },
      data: validatedValues,
      select: getUserData(user.id),
    });

    // stream user
    await streamServer.partialUpdateUser({
      id: user.id,
      set: {
        name: validatedValues.name,
      },
    });

    // return updated user data to client
    return updatedUser;
  });

  // return updated user data to client
  return updatedUser;
}
