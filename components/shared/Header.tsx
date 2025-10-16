"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";

type HeaderProps = {
  isAdmin?: boolean;
};

const Header = ({ isAdmin = false }: HeaderProps) => {
  return (
    <header className="w-full border-b border-gray-200 py-3 md:py-4 bg-white shadow-sm">
      <div className="wrapper flex items-center justify-between">
        {/* Logo */}
        <Link href={isAdmin ? "/admin" : "/"} className="w-36">
          <Image
            src="/assets/images/logo.svg"
            width={128}
            height={38}
            alt="Eventy logo"
          />
        </Link>

        {/* Navigation (hide for admin) */}
        <SignedIn>
          {!isAdmin && (
            <nav
              className="md:flex md:flex-between hidden 
              w-full max-w-xs"
            >
              <NavItems />
            </nav>
          )}
        </SignedIn>

        {/* Right side */}
        <div className="flex w-36 justify-end gap-3 items-center">
          {/* Admin badge */}
          {isAdmin && (
            <span className="text-xs font-semibold text-red-500 bg-red-100 px-3 py-1 rounded-full">
              Admin Mode
            </span>
          )}

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            {!isAdmin && <MobileNav />}
          </SignedIn>

          <SignedOut>
            <Button asChild className="rounded-full" size="lg">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
