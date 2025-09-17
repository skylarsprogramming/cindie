import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import fs from 'fs';

dotenv.config();

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (e) {
    const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './serviceAccountKey.json';
    if (!fs.existsSync(keyPath)) {
      console.error('Firebase Admin failed to initialize. Provide credentials via GOOGLE_APPLICATION_CREDENTIALS or serviceAccountKey.json.');
      console.error(String(e));
      process.exit(1);
    }
    const serviceAccountJson = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountJson),
    });
  }
}

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) return res.status(401).json({ error: 'Missing Authorization Bearer token' });
  const idToken = match[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token', details: err?.message });
  }
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.get('/api/protected', verifyFirebaseToken, async (req, res) => {
  // Enforce verified email for email/password accounts
  if (req.user.firebase?.sign_in_provider === 'password' && !req.user.email_verified) {
    return res.status(403).json({ error: 'Email not verified' });
  }
  res.json({
    message: 'Protected data',
    uid: req.user.uid,
    email: req.user.email || null,
    phone_number: req.user.phone_number || null,
    email_verified: !!req.user.email_verified,
    provider: req.user.firebase?.sign_in_provider || null,
  });
});

// --- User profile storage (Firestore) ---
let db = null;
try { db = admin.firestore(); } catch (_) { db = null; }

function defaultProfile(uid, email) {
  return {
    uid,
    email: email || null,
    placementCompleted: false,
    recommendations: [],
    progress: {
      keepLearning: { course: '', progress: 0 },
      subjects: [ { name: 'IELTS preparation', xp: 0 }, { name: 'English B2', xp: 0 } ],
      weeklyTarget: { targetDays: 3, completedDays: 0, days: { monday:false, tuesday:false, wednesday:false, thursday:false, friday:false, saturday:false, sunday:false } }
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
}

app.post('/api/profile/init', verifyFirebaseToken, async (req, res) => {
  if (!db) return res.status(500).json({ error: 'Firestore not available' });
  const uid = req.user.uid;
  const ref = db.collection('users').doc(uid);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set(defaultProfile(uid, req.user.email));
  }
  const doc = await ref.get();
  res.json(doc.data());
});

app.get('/api/profile', verifyFirebaseToken, async (req, res) => {
  if (!db) return res.status(500).json({ error: 'Firestore not available' });
  const uid = req.user.uid;
  const ref = db.collection('users').doc(uid);
  const snap = await ref.get();
  if (!snap.exists) {
    const profile = defaultProfile(uid, req.user.email);
    await ref.set(profile);
    return res.json(profile);
  }
  res.json(snap.data());
});

app.post('/api/placement/complete', verifyFirebaseToken, async (req, res) => {
  if (!db) return res.status(500).json({ error: 'Firestore not available' });
  const uid = req.user.uid;
  const { result, recommendations } = req.body || {};
  const ref = db.collection('users').doc(uid);
  await ref.set({
    placementCompleted: true,
    recommendations: Array.isArray(recommendations) ? recommendations : [],
    placementResult: result || null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  const doc = await ref.get();
  res.json(doc.data());
});

app.post('/api/progress', verifyFirebaseToken, async (req, res) => {
  if (!db) return res.status(500).json({ error: 'Firestore not available' });
  const uid = req.user.uid;
  const { keepLearning, subjects, weeklyTarget } = req.body || {};
  const ref = db.collection('users').doc(uid);
  const updates = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
  if (keepLearning) updates['progress.keepLearning'] = keepLearning;
  if (subjects) updates['progress.subjects'] = subjects;
  if (weeklyTarget) updates['progress.weeklyTarget'] = weeklyTarget;
  await ref.set(updates, { merge: true });
  const doc = await ref.get();
  res.json(doc.data());
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});



