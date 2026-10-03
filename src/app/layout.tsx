import type { Metadata } from "next"
import { cookies } from "next/headers"
import { ThemeProvider } from "next-themes"
import {
  Fraunces,
  Fredoka,
  Geist_Mono,
  Karla,
  Manrope,
  Nunito,
  Source_Sans_3,
} from "next/font/google"
import { EstiloProvider } from "@/lib/tema/estilo-provider"
import { ESTILO_COOKIE, ESTILO_DEFAULT } from "@/lib/tema/cookie"
import { esEstiloId } from "@/lib/tema/estilos"
import "./globals.css"

const sourceSans3 = Source_Sans_3({ variable: "--font-source-sans-3", subsets: ["latin"], display: "swap", preload: false })
const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["latin"], display: "swap", preload: false })
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"], display: "swap", preload: false })
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap", preload: false })
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap", preload: false })
const karla = Karla({ variable: "--font-karla", subsets: ["latin"], display: "swap", preload: false })
const geistMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"], display: "swap", preload: false })

export const metadata: Metadata = {
  title: "Centro Educativo",
  description: "Sistema de gestión de un centro educativo y terapéutico",
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies()
  const raw = cookieStore.get(ESTILO_COOKIE)?.value
  const estilo = esEstiloId(raw) ? raw : ESTILO_DEFAULT

  return (
    <html
      lang="es"
      data-estilo={estilo}
      suppressHydrationWarning
      className={`${sourceSans3.variable} ${fredoka.variable} ${nunito.variable} ${manrope.variable} ${fraunces.variable} ${karla.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <EstiloProvider estiloInicial={estilo}>{children}</EstiloProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
