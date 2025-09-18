import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Separator } from "../ui/separator";
import NavItems from "./NavItems";

const MobileNav = () => {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger className="align-middle">
          <Image
            src="/assets/icons/menu.svg"
            width={24}
            height={24}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent
          className="flex flex-col gap-6 bg-white 
            md:hidden"
        >
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={128}
            height={38}
          />
          <Separator className="border border-gray-50" />

          <div className="pl-5">
            <NavItems />
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};
export default MobileNav;
