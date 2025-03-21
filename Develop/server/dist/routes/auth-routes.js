import { Router } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
export const login = async (req, res) => {
    // TODO: If the user exists and the password is correct, return a JWT token
    try {
        const { username, password } = req.body;
        const user = await User.findOne({
            where: {
                username: username,
            },
        });
        if (!user) {
            return res.sendStatus(404).json({ message: 'User not found' });
        }
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return res.sendStatus(401).json({ message: 'Invalid password' });
        }
        const secretKey = process.env.JWT_SECRET_KEY || '';
        const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
        return res.json({ token });
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(500).json({ message: 'Something went wrong' });
    }
};
const router = Router();
// POST /login - Login a user
router.post('/login', login);
export default router;
