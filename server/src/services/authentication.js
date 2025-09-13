import { admin } from './firebaseAdmin.js';

// Utility function to extract the token from the request
const extractToken = (req) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return null;
    const token = authorizationHeader.split('Bearer ')[1];
    return token || null;
};

// The actual authentication middleware
const authenticate = async (req, res, next) => {
    // console.log(req)
    const token = extractToken(req);
    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing or malformed' });
    }

    try {
        // Verify the ID token with Firebase Admin SDK
        await admin.auth().verifyIdToken(token).then((decodedToken) => {
            req.user = decodedToken; // Attach decoded token to request object
        });
        next();
    }
    catch (error) {
        console.error('Authentication error: ', error); // Log error for debugging purposes
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default authenticate;
