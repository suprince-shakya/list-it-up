import * as nodemailer from 'nodemailer';
import Email from 'email-templates';

const transport = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	secure: true,
	auth: {
		user: process.env.SMTP_USERNAME,
		pass: process.env.SMTP_PASSWORD,
	},
});

export const tEmail = new Email({
	message: {
		from: process.env.SMTP_FROM,
	},
	send: true,
	transport,
});

type IDatas = {
	[key: string]: string | number;
};

export const sendMail = async (template: string, to: string[], datas: IDatas) => {
	try {
		await tEmail.send({
			template,
			message: {
				to,
			},
			locals: {
				data: datas,
				host: process.env.APP_HOST,
			},
		});
	} catch (err) {
		console.log(err);
	}
};
