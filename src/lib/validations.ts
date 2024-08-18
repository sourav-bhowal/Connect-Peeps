import { z } from "zod";

// SIGN-UP SCHEMA
export const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must not exceed 32 characters"),
  username: z
    .string()
    .trim()
    .min(5, "Username must be at least 5 characters")
    .max(32, "Username must not exceed 32 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, _ , - and numbers ",
    ),
});

// SIGN-IN SCHEMA
export const signInSchema = z.object({
  username: z
    .string()
    .trim()
    .min(5, "Username must be at least 5 characters")
    .max(32, "Username must not exceed 32 characters"),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must not exceed 32 characters"),
});

// SCHEMA VALIDATIONS FOR FORMS
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type SignInSchemaType = z.infer<typeof signInSchema>;

// POST SCHEMA
export const createPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(5, "Content must be atleast 5 characters")
    .max(300, "Content must not exceed 300 characters"),
  mediaIds: z.array(z.string()).max(5, "Max 5 media per post"),
});

// UPDATE POST SCHEMA
export const updatePostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(5, "Content must be atleast 5 characters")
    .max(300, "Content must not exceed 300 characters"),
});

// SCHEMA VALIDATIONS FOR CREATE FORM
export type UpdatePostSchemaType = z.infer<typeof updatePostSchema>;

// UPDATE USER SCHEMA
export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, "Username must be at least 5 characters")
    .max(32, "Username must not exceed 32 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, _ , - and numbers ",
    ),
  bio: z
    .string()
    .trim()
    .min(5, "Username must be at least 5 characters")
    .max(200, "Bio must not exceed 200 characters"),
});

// SCHEMA VALIDATIONS FOR UPDATE FORM
export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;

// COMMENT SCHEMA
export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(2, "Content must be atleast 2 characters")
    .max(300, "Content must not exceed 300 characters"),
});
