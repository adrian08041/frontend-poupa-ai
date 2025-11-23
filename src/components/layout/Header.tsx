"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { UserProfileCard } from "@/components/ui/user-profile-card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Transações", href: "/transactions" },
  { name: "Fixas", href: "/recurring-transactions" },
  { name: "Relatórios", href: "/reports" },
  { name: "PoupaAI Zap", href: "/whatsapp-ai" },
  { name: "Assinatura", href: "/subscription" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fecha o menu quando a rota muda
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Previne scroll quando o menu está aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="border-b border-light-gray dark:border-dark-gray bg-white dark:bg-background-01 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 z-50">
            <Image src="/logo-pequena.png" alt="Logo" width={32} height={32} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
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

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <UserProfileCard />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden z-50 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-gray transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray dark:text-light-gray" />
            ) : (
              <Menu className="w-6 h-6 text-gray dark:text-light-gray" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-background-01 z-40 md:hidden transition-transform duration-300 ease-in-out shadow-2xl",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full pt-20 px-6">
          {/* Mobile Navigation Links */}
          <nav className="flex flex-col gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-base font-medium transition-all px-4 py-3 rounded-lg",
                    isActive
                      ? "bg-green/10 text-green font-semibold"
                      : "text-gray dark:text-light-gray hover:bg-gray-100 dark:hover:bg-dark-gray"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Actions */}
          <div className="mt-auto pb-6 pt-6 border-t border-light-gray dark:border-dark-gray">
            <div className="flex items-center justify-between gap-4 px-4">
              <ThemeToggle />
              <UserProfileCard />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

