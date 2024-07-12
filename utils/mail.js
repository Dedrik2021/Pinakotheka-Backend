import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


export const transport = nodemailer.createTransport({
	service: process.env.EMAIL_HOST,
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASS,
        port: 587
	},
	tls: {
		rejectUnauthorized: false,
	},
});