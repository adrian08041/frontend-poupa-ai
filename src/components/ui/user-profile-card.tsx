"use client";

import { useState, useEffect } from "react";
import { LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProfileSettingsDialog } from "@/components/ui/profile-settings-dialog";
import { signOut } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

interface UserData {
  name: string;
  email: string;
  sub: string;
}

export function UserProfileCard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          name: data.name || "Usuário",
          email: data.email || "",
          sub: data.id || "",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileUpdate = async (data: { name: string }) => {
    await loadUserData();
  };

  if (!user) return null;

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 rounded-full hover:opacity-80 transition-opacity">
            <Avatar className="h-9 w-9 cursor-pointer border-2 border-light-gray dark:border-dark-gray">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className="bg-green text-white text-sm font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-light-gray dark:border-dark-gray">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback className="bg-green text-white font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray dark:text-light-gray">
                    {user.email}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-t border-light-gray dark:border-dark-gray">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSettingsOpen(true);
                  }}
                  className="flex w-full items-center gap-3 px-6 py-3 text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-background-01 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Configurações
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-6 py-3 text-sm text-red-600 dark:text-red-500 hover:bg-gray-50 dark:hover:bg-background-01 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>

      <ProfileSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        initialData={{ name: user.name, email: user.email }}
        onProfileUpdate={handleProfileUpdate}
      />
    </>
  );
}
