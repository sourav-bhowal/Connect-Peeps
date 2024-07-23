import { Metadata } from "next";
import signupImage from "@/assets/signup-image.jpg";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm";

// METADATA
export const metadata: Metadata = {
  title: "Sign Up",
};

// SIGN UP PAGE
export default function SignUpPage() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign up to ConnectPeeps</h1>
            <p className="text-muted-foreground">
              A place where <span className="italic">you</span> find friends.
            </p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link href="/signin" className="block text-center hover:underline">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
        <Image
          src={signupImage}
          alt="image"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
