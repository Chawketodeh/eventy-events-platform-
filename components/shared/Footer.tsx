import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t  border-gray-200 ">
      <div
        className="wrapper flex flex-center flex-col flex-between
       gap-4 p-5 text-center sm:flex-row"
      >
        <Link href="/">
          <Image
            src="/assets/images/logo.svg"
            width={128}
            height={38}
            alt="logo"
          ></Image>
        </Link>
        <p> 2025 Eventy. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;
