import { NextResponse } from 'next/server'

function clearCookieResponse() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('auth_token', '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}

export async function POST() {
  return clearCookieResponse()
}

export async function GET() {
  return clearCookieResponse()
}




