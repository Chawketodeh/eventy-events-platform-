"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function Page() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      if (isSignedIn && user) {
        //  force refresh user metadata
        await user.reload();

        const isAdmin = user.publicMetadata?.isAdmin === true;
        console.log(" User metadata after reload:", user.publicMetadata);

        //  redirect after reload
        router.push(isAdmin ? "/admin" : "/");
      }
    };

    checkAdmin();
  }, [isSignedIn, user, router]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-primary-50 bg-dotted-pattern bg-cover bg-center">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignOutUrl="/"
        appearance={{
          elements: {
            card: "shadow-xl rounded-2xl",
            footer: "hidden",
          },
        }}
      />
      <p className="mt-4 text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link href="/sign-up" className="font-bold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
