import jwt from 'jsonwebtoken';

export function signInternalToken(user) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET not configured');
    }

    return jwt.sign(
        {
            email: user.email,
            role: user.role,
            userId: user.id,
            status: user.status || 'Active',
        },
        secret,
        { expiresIn: '1h' }
    );
}