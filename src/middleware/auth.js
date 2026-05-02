const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    let token;

    // 1. Check if token exists in the Authorization header
    // Standard format: "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (split "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Attach the user data to the request object
            // This makes 'req.user' available in all subsequent routes
            req.user = decoded;
            console.log('Decoded User:', req.user);
            

            next(); // Move to the next middleware or route handler
        } catch (error) {
            return res.status(401).json({ status: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ status: false, message: 'Not authorized, no token' });
    }
};

module.exports = { protect };