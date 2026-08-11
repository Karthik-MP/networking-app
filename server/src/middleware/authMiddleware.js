import admin from 'firebase-admin';

export default async function authenticate(req, res, next) {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return res.status(401).send({ message: 'Unauthorized' });
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send({ message: 'Invalid Token' });
    }
}
