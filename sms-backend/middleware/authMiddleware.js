import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try {
        // 1. when frontend requests backend it send headers too
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        // 2. Extract token (Bearer <token>)
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Invalid token format"
            });
        }

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach user info to request
        req.user = decoded;

        next();
    }

    catch (err) {
        return res.status(401).json({
            message: "Token expired or invalid"
        });
    }
}
