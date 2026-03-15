"use client";

import { useTheme } from "next-themes";
import LogoLight from "../../public/images/logo-light.svg";
import LogoDark from "../../public/images/logo-dark.svg";
import Image from "next/image";

export const Logo = () => {
  const { theme } = useTheme();

  return (
    <div className={"flex items-center gap-2.5 select-none"}>
      {theme === "dark" ? (
        <Image src={LogoDark} alt="logo" width={200} height={200} />
      ) : (
        <Image src={LogoLight} alt="logo" width={200} height={200} />
      )}
    </div>
  );
};
