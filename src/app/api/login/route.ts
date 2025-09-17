import { NextResponse } from 'next/server'
import { readUsers, hashPassword, signToken, safeUser } from '@/lib/users'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { usernameOrEmail, password } = body || {}
    if (!usernameOrEmail || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }

    const db = await readUsers()
    const user = db.users.find(u => u.username === usernameOrEmail || u.email.toLowerCase() === String(usernameOrEmail).toLowerCase())
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const { hash } = hashPassword(password, user.passwordSalt)
    if (hash !== user.passwordHash) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signToken({ sub: user.id, u: user.username, iat: Date.now() })

    const res = NextResponse.json({ user: safeUser(user) })
    res.cookies.set('auth_token', token, { httpOnly: true, sameSite: 'lax', path: '/' })
    return res
  } catch (e: any) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}




