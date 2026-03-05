import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'es'] as const
type Locale = (typeof locales)[number]

function getLocale(request: NextRequest): Locale {
  // 1) Preferencia guardada (cookie)
  const saved = request.cookies.get('lang')?.value
  if (saved === 'en' || saved === 'es') return saved

  // 2) Navegador (Accept-Language)
  const accept = request.headers.get('accept-language')?.toLowerCase() ?? ''
  if (accept.startsWith('es')) return 'es'
  return 'en'
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Si ya viene con /en o /es, guardamos cookie y seguimos
  const hasLocale = locales.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  )

  if (hasLocale) {
    const loc = pathname.split('/')[1] as Locale
    const res = NextResponse.next()
    res.cookies.set('lang', loc, { path: '/', maxAge: 60 * 60 * 24 * 365 })
    return res
  }

  // Si NO tiene locale, redirigir a /{locale}{pathname}
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  const res = NextResponse.redirect(request.nextUrl)
  res.cookies.set('lang', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 })
  return res
}

export const config = {
  matcher: [
    // Igual que recomienda la guía: evitar _next
    '/((?!_next).*)',
  ],
}