"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Events" },
    { href: "/tickets", label: "My Tickets" },
    { href: "/project", label: "About Project" },
  ];

  return (
    <header className="flex justify-between items-center w-full px-4 py-5 border rounded-3xl bg-primary/40 h-[76px] border-borderone">
      <div>
        {/* logo */}
        <Image src="/logo.svg" alt="logo" width={91} height={36} />
      </div>
      {/* menu */}
      <div className="hidden md:flex">
        <ul className="flex gap-4 text-subdued text-lg">
          {navLinks.map((link) => (
            <li key={link.href} className="p-[10px] hover:text-white">
              <Link
                href={link.href}
                className={`${pathname === link.href ? "text-white" : ""} hover:text-white`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* button */}
      <Link href="/tickets">
        <button className="bg-white rounded-xl py-4 px-6 text-[#0A0C11] flex gap-2 items-center transition-[gap,colors] duration-300 hover:gap-3 group hover:bg-greenone border border-[#D5EA00]/10 hover:border-[#D9D9D9] hover:text-white">
          <span>MY TICKETS</span>
          <Image
            src="/arrowright.svg"
            alt="arrow"
            width={16}
            height={16}
            className="transition-[transform,filter] duration-300 group-hover:-rotate-45 group-hover:brightness-0 group-hover:invert"
          />
        </button>
      </Link>
    </header>
  );
};

export default Navigation;
