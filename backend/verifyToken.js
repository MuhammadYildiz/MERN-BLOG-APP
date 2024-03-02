const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    /* cet token from saved in cookie */
    const token = req.cookies.token
    /* Control token is in cookie or not */
    if (!token) {
        return res.status(401).json({ message: "You are not authenticated!" });
    }
    /* verify token with  jwt.verify and token secret key */
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, async (err, data) => {
        /* control token is verified or not */
        if (err) {
            return res.status(403).json({ message: "Token is not valid" });
        }
        /* if token verified can user get authenticated */
        req.userId = data.id
        next()
    })
}
/* export verify token middle ware for use in other methods */
module.exports = verifyToken