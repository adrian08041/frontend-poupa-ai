"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { UserProfileCard } from "@/components/ui/user-profile-card";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Transações", href: "/transactions" },
  { name: "Relatórios", href: "/reports" },
  { name: "Assinatura", href: "/subscription" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-light-gray dark:border-dark-gray bg-white dark:bg-background-01">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/logo-pequena.png" alt="Logo" width={32} height={32} />
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-green",
                    isActive
                      ? "text-green font-semibold"
                      : "text-gray dark:text-light-gray"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserProfileCard />
          </div>
        </div>
      </div>
    </header>
  );
}

