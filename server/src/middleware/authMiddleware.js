const createError = require('http-errors');
// FIX: Using modern modular imports for Firebase Admin v10+
const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

let appInitialized = false;

const getAuthInstance = () => {
  if (!appInitialized) {
    if (getApps().length === 0) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (!projectId || !clientEmail || !rawPrivateKey) {
        console.error("❌ ERROR: Missing Firebase Admin environment variables.");
        throw createError(500, 'Firebase Admin credentials are not configured on the server');
      }

      const privateKey = rawPrivateKey.replace(/\\n/g, '\n');

      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
    }
    appInitialized = true;
  }
  return getAuth(); 
};

const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(createError(401, 'Authentication required'));
  }

  try {
    // FIX: No 'true' flag, so clock-skew is ignored.
    const decoded = await getAuthInstance().verifyIdToken(token);
    
    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      name: decoded.name || null,
      picture: decoded.picture || null,
    };
    return next();
  } catch (err) {
    console.error('\n🔥 FIREBASE TOKEN REJECTED:', err.code, err.message);
    return res.status(401).json({ 
      error: `FIREBASE_REJECTED: [${err.code}] ${err.message}` 
    });
  }
};

module.exports = { requireAuth };