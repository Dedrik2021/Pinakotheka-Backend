import { createUser, signUser } from '../services/auth.service.js';
import { generateToken } from '../services/token.service.js';

export const register = async (req, res, next) => {
	try {
		const { name, email, picture, password } = req.body;
		const newUser = await createUser({ name, email, picture, password });

		const access_token = await generateToken(
			{ userId: newUser._id },
			'7d',
			process.env.ACCESS_TOKEN,
		);
		const refresh_token = await generateToken(
			{ userId: newUser._id },
			'30d',
			process.env.REFRESH_TOKEN,
		);

        res.cookie('refresh-token', refresh_token, {
            httpOnly: true,
            path: '/api/v1/auth/refresh-token',
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

		res.status(201).json({
            message: "register successfully",
            access_token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                picture: newUser.picture,
            }
        });
	} catch (error) {
		next(error);
	}
};

export const login = async (req, res, next) => {
    try {
        const {email, password} = req.body
        const user = await signUser(email, password)

        const access_token = await generateToken(
			{ userId: user._id },
			'7d',
			process.env.ACCESS_TOKEN,
		);
		const refresh_token = await generateToken(
			{ userId: user._id },
			'30d',
			process.env.REFRESH_TOKEN,
		);

        res.cookie('refresh-token', refresh_token, {
            httpOnly: true,
            path: '/api/v1/auth/refresh-token',
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

		res.status(201).json({
            message: "register successfully",
            access_token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
            }
        });
    } catch(error) {
        next(error)
    }
};

export const logout = async (req, res, next) => {
    try {
        res.clearCookie("refresh-token", {path: "/api/v1/auth/refresh-token"})
        res.status(201).json({
            message: "Logged out."
        })
    } catch(error) {
        next(error)
    }
};

export const refreshToken = async (req, res, next) => {
    try {

    } catch(error) {
        next(error)
    }
};
