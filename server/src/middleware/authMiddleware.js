const createError = require('http-errors');
const admin = require('firebase-admin');

let appInitialized = false;

const getAuth = () => {
  if (!appInitialized) {
    if (admin.apps.length === 0) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (!projectId || !clientEmail || !rawPrivateKey) {
        throw createError(500, 'Firebase Admin credentials are not configured on the server');
      }

      // Env vars mangle newlines; restore them for the RSA key parser.
      const privateKey = rawPrivateKey.replace(/\\n/g, '\n');

      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      });
    }
    appInitialized = true;
  }
  return admin.auth();
};

// Routes that must never be reachable without a valid Firebase ID token.
const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(createError(401, 'Authentication required'));
  }

  try {
    const decoded = await getAuth().verifyIdToken(token, true);
    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
    };
    return next();
  } catch (err) {
    return next(createError(401, 'Invalid or expired authentication token'));
  }
};

module.exports = { requireAuth };
