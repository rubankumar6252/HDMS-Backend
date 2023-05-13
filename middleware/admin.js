import jwt from 'jsonwebtoken';

function admin(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(400).send('Access Denied token required');
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    // console.log(decoded);
    req.user = decoded;
    if (!req.user.role) return res.status(403).send('Access Denied you are not admin user')
    next()
}

export default admin;