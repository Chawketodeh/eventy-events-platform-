import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
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
            footer: "hidden", // hide built-in footer
          },
        }}
      />

      {/* 👇 custom message outside the card */}
      <p className="mt-4 text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link href="/sign-up" className=" font-bold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
