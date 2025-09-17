import { NextResponse } from 'next/server'
import { readUsers, writeUsers, hashPassword, safeUser, UserRecord } from '@/lib/users'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email, phone, age, password } = body || {}

    if (!username || !email || !phone || !age || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }
    if (!/^[\w.-]{3,20}$/.test(username)) {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 })
    }
    if (!/^\+?[0-9\-\s]{7,15}$/.test(String(phone))) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }
    const ageNum = Number(age)
    if (!Number.isFinite(ageNum) || ageNum < 5 || ageNum > 120) {
      return NextResponse.json({ error: 'Invalid age' }, { status: 400 })
    }

    const db = await readUsers()
    const exists = db.users.find(u => u.username === username || u.email.toLowerCase() === String(email).toLowerCase())
    if (exists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    const { hash, salt } = hashPassword(password)
    const record: UserRecord = {
      id: crypto.randomUUID(),
      username,
      email: String(email).toLowerCase(),
      phone: String(phone),
      age: ageNum,
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: new Date().toISOString()
    }
    db.users.push(record)
    await writeUsers(db)

    return NextResponse.json({ user: safeUser(record) }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 })
  }
}




