"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

function Header() {
  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);
  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-md">
      <Image src={"/logo.svg"} width={160} height={100} alt="logo" />
      <ul className="hidden md:flex gap-16 ml-4  mr-16">
        <li>
          <Link
            href="/dashboard"
            className={`cursor-pointer hover:text-primary hover:font-bold transition-all ${
              path == "/dashboard" ? "text-primary font-bold" : ""
            }`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/questions"
            className={`cursor-pointer hover:text-primary hover:font-bold transition-all ${
              path == "/dashboard/questions" ? "text-primary font-bold" : ""
            }`}
          >
            Questions
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/upgrade"
            className={`cursor-pointer hover:text-primary hover:font-bold transition-all ${
              path == "/dashboard/upgrade" ? "text-primary font-bold" : ""
            }`}
          >
            Upgrade
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/how"
            className={`cursor-pointer hover:text-primary hover:font-bold transition-all ${
              path == "/dashboard/how" ? "text-primary font-bold" : ""
            }`}
          >
            How it works?
          </Link>
        </li>
      </ul>
      <UserButton />
    </div>
  );
}

export default Header;
