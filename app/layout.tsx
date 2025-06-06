import React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { RoleThemeProvider } from "@/components/role-theme-provider"
import Header from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/lib/auth-context"
import { ReactQueryProvider } from "@/hooks/useReactQuerySetup"
import { MobileNavigation } from "@/components/ui/mobile-navigation"
import { ClientLayoutWrapper } from "@/components/client-layout-wrapper"
import { EchoInitializer } from "@/components/echo-initializer"
import { MessageProvider } from "@/components/providers/message-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CarShare - Location de voitures entre particuliers",
  description: "Plateforme de mise en relation entre propriétaires de voitures et locataires potentiels",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ReactQueryProvider>
          <AuthProvider>
            <ThemeProvider>
              <RoleThemeProvider>
                <MessageProvider>
                  <ClientLayoutWrapper>
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-1">{children}</main>
                      <Footer />
                      <MobileNavigation />
                      <EchoInitializer />
                    </div>
                  </ClientLayoutWrapper>
                </MessageProvider>
              </RoleThemeProvider>
            </ThemeProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
