"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-background-02 dark:group-[.toaster]:text-white dark:group-[.toaster]:border-dark-gray",
          description: "group-[.toast]:text-gray dark:group-[.toast]:text-light-gray",
          actionButton:
            "group-[.toast]:bg-green group-[.toast]:text-white hover:group-[.toast]:bg-green/90",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-900 dark:group-[.toast]:bg-dark-gray dark:group-[.toast]:text-white",
          success:
            "group-[.toaster]:bg-green/10 group-[.toaster]:border-green group-[.toaster]:text-green dark:group-[.toaster]:bg-green/20",
          error:
            "group-[.toaster]:bg-red/10 group-[.toaster]:border-red group-[.toaster]:text-red dark:group-[.toaster]:bg-red/20",
          warning:
            "group-[.toaster]:bg-yellow-500/10 group-[.toaster]:border-yellow-500 group-[.toaster]:text-yellow-600 dark:group-[.toaster]:bg-yellow-500/20",
          info:
            "group-[.toaster]:bg-blue-500/10 group-[.toaster]:border-blue-500 group-[.toaster]:text-blue-600 dark:group-[.toaster]:bg-blue-500/20",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
