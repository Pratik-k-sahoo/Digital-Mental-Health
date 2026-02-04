const axios = require("axios");
const emailjs = require("@emailjs/browser");

const sendLoginMail = async (to, subject, message) => {
	try {
		const formData = {
			email: to.email,
			name: to.name,
			role: to.role,
			department: to.department || "",
			passingYear: to.year || "",
			subject,
			message,
		};

		var data = {
			service_id: process.env.MAILER_SERVICE_ID,
			template_id: process.env.MAILER_LOGIN_TEMPLATE,
			user_id: process.env.MAILER_PUBLIC_KEY,
			template_params: formData,
			accessToken: process.env.MAILER_PRIVATE_KEY,
		};

		const response = await axios.post(
			"https://api.emailjs.com/api/v1.0/email/send",
			JSON.stringify(data),
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (response.status === 200) {
		} else {
		}
	} catch (error) {
		console.error("❌ Mail Error: ", error.message);
		throw error;
	}
};

const sendBookingGeneratedMail = async (to, subject, message) => {
	try {
		const formData = {
			email: to.email,
			subject,
			message,
		};

		var data = {
			service_id: process.env.MAILER_SERVICE_ID,
			template_id: process.env.MAILER_BOOKING_TEMPLATE,
			user_id: process.env.MAILER_PUBLIC_KEY,
			template_params: formData,
			accessToken: process.env.MAILER_PRIVATE_KEY,
		};

		const response = await axios.post(
			"https://api.emailjs.com/api/v1.0/email/send",
			JSON.stringify(data),
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (response.status === 200) {
		} else {
		}
	} catch (error) {
		console.error("❌ Mail Error: ", error.message);
		throw error;
	}
};

module.exports = { sendLoginMail, sendBookingGeneratedMail };
