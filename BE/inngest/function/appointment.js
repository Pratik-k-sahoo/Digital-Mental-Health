const { where } = require("sequelize");
const { Appointment, User } = require("../../models");
const { inngest } = require("../client.js");
const { NonRetriableError, step } = require("inngest");
const { sendBookingGeneratedMail } = require("../../services/mailer.js");

const bookingGenerated = inngest.createFunction(
	{ id: "booking-generated" },
	{ event: "appointment/booking.generated" },
	async ({ event, step }) => {
		const { appointmentId, url } = event.data;

		const appointment = await step.run("fetch-appointment", async () =>
			Appointment.findOne({
				where: {
					id: appointmentId,
				},
				include: [
					{ model: User, as: "Counsellor" },
					{ model: User, as: "Student" },
				],
			}),
		);

		if (!appointment) return;

		const subject = `Action Required: Confirm Your Appointment on E-Psycho Support`;

		const message = `<p>Dear ${appointment?.Student?.name},</p> <p> This email is to inform you that an appointment has been successfully <strong>created</strong> on <strong>E-Psycho Support</strong>. The appointment is currently in a <strong>pending</strong> state and requires your confirmation. </p> <h4>Appointment Details</h4> <table cellpadding="6" cellspacing="0" style="font-size:14px;"> <tr> <td><strong>Student Name:</strong></td> <td>${appointment?.Student?.name}</td> </tr> <tr> <td><strong>Counsellor:</strong></td> <td>${appointment?.Counsellor?.name}</td> </tr> <tr> <td><strong>Appointment Type:</strong></td> <td>${appointment?.appointmentType}</td> </tr> <tr> <td><strong>Date & Time:</strong></td> <td>${appointment?.datetime}</td> </tr> <tr> <td><strong>Status:</strong></td> <td>Pending Confirmation</td> </tr> </table> <p style="margin-top:16px;"> To confirm your booking, please click the button below and review the appointment details: </p> <p style="text-align:center; margin:24px 0;"> <a href="${url}" style="background-color:#2f855a; color:#ffffff; padding:12px 20px; text-decoration:none; border-radius:4px; display:inline-block;"> Confirm Appointment </a> </p> <p style="font-size:13px; color:#555;"> Please note: This confirmation link is valid for a limited time and will expire in approximately <strong>5 minutes</strong>. If the link expires, you may need to create the appointment again. </p> <h4>Important Notice</h4> <p style="font-size:13px; color:#555;"> E-Psycho Support is a mental health support platform and does not replace professional medical or emergency services. If you experience immediate distress or are in danger, please contact local emergency services or a trusted authority. </p> <p> If you did not initiate this appointment or need assistance, please contact us at <a href="mailto:support@epsychosupport.com">support@epsychosupport.com</a>. </p> <p style="margin-top:24px;"> Sincerely,<br /> <strong>The E-Psycho Support Team</strong><br /> <em style="color:#777;">Care • Confidentiality • Support</em> </p>`;

		await step.run("send-booking-generated-email", async () => {
			const user = appointment.Student;
			await sendBookingGeneratedMail(user, subject, message);
		});
		return { success: true };
	},
);

const bookingConfirmed = inngest.createFunction(
	{ id: "booking-confirmed" },
	{ event: "appointment/booking.confirmed" },
	async ({ event, step }) => {
		const { appointmentId, status } = event.data;

		const appointment = await step.run("fetch-appointment", async () =>
			Appointment.findOne({
				where: {
					id: appointmentId,
				},
				include: [
					{ model: User, as: "Counsellor" },
					{ model: User, as: "Student" },
				],
			}),
		);

		if (!appointment) return;

		let subject = ``;
		let message = ``;

		if (status === "cancelled") {
			subject = `Update: Your Appointment Has Been Cancelled`;
			message = `<p>Dear ${appointment?.Student?.name},</p> <p> Your appointment scheduled with <strong>${appointment?.Counsellor?.name}</strong> has been cancelled. </p> <p><strong>Date & Time:</strong> ${appointment?.datetime}</p> <p><strong>Status:</strong> Cancelled</p> <p> You may create a new appointment at a time that works best for you. </p> <p>If you need assistance, contact <a href="mailto:support@epsychosupport.com">support@epsychosupport.com</a>.</p> <p>Kind regards,<br /><strong>E-Psycho Support Team</strong></p>`;
		} else if (status === "expired") {
			subject = `Appointment Expired – Action Needed`;
			message = `<p>Dear ${appointment?.Student?.name},</p> <p> Your appointment request with <strong>${appointment?.Counsellor?.name}</strong> could not be confirmed in time and has expired. </p> <p><strong>Date & Time:</strong> ${appointment?.datetime}</p> <p><strong>Status:</strong> Expired</p> <p> To proceed, please create a new appointment through your account. </p> <p>If you need help, contact <a href="mailto:support@epsychosupport.com">support@epsychosupport.com</a>.</p> <p>Regards,<br /><strong>E-Psycho Support Team</strong></p>`;
		} else if(status === "confirmed") {
      subject = `Your Appointment Has Been Confirmed – E-Psycho Support`;
			message = `<p>Dear ${appointment?.Student?.name},</p> <p> We’re writing to confirm that your appointment on <strong>E-Psycho Support</strong> has been successfully confirmed. </p> <h4>Appointment Details</h4> <table cellpadding="6" cellspacing="0" style="font-size:14px;"> <tr> <td><strong>Student Name:</strong></td> <td>${appointment?.Student?.name}</td> </tr> <tr> <td><strong>Counsellor:</strong></td> <td>${appointment?.Counsellor?.name}</td> </tr> <tr> <td><strong>Appointment Type:</strong></td> <td>${appointment?.appointmentType}</td> </tr> <tr> <td><strong>Date & Time:</strong></td> <td>${appointment?.datetime}</td> </tr> <tr> <td><strong>Status:</strong></td> <td style="color:#2f855a;"><strong>Confirmed</strong></td> </tr> </table> <p style="margin-top:16px;"> Please ensure you are available 15 mins prior to the scheduled time. If you are unable to attend, we recommend cancelling the appointment in advance through the counsellor desk. </p> <h4>Important Reminder</h4> <p style="font-size:13px; color:#555;"> E-Psycho Support provides emotional and mental health support and does not replace emergency or medical services. If you experience immediate distress or are in danger, please contact local emergency services or a trusted authority. </p> <p> If you have any questions or require assistance, feel free to contact us at <a href="mailto:support@epsychosupport.com">support@epsychosupport.com</a>. </p> <p style="margin-top:24px;"> We look forward to supporting you.<br /><br /> Sincerely,<br /> <strong>The E-Psycho Support Team</strong><br /> <em style="color:#777;">Care • Confidentiality • Support</em> </p>`;
    }
    
		await step.run("send-booking-confirmed-email", async () => {
			const user = appointment.Student;
			await sendBookingGeneratedMail(user, subject, message);
		});
		return { success: true };
	},
);

const bookingStatusChanged = inngest.createFunction(
	{ id: "booking-status-changed" },
	{ event: "appointment/status.changed" },
	async ({ event, step }) => {
		const { appointmentId, status } = event.data;

		const appointment = await step.run("fetch-appointment", async () =>
			Appointment.findOne({
				where: {
					id: appointmentId,
				},
				include: [
					{ model: User, as: "Counsellor" },
					{ model: User, as: "Student" },
				],
			}),
		);

		if (!appointment) return;

		let subject = ``;
		let message = ``;

		if (status === "cancelled") {
			subject = `Update: Your Appointment Has Been Cancelled`;
			message = `<p>Dear ${appointment?.Student?.name},</p> <p> Your appointment scheduled with <strong>${appointment?.Counsellor?.name}</strong> has been cancelled. </p> <p><strong>Date & Time:</strong> ${appointment?.datetime}</p> <p><strong>Status:</strong> Cancelled</p> <p> You may create a new appointment at a time that works best for you. </p> <p>If you need assistance, contact <a href="mailto:support@epsychosupport.com">support@epsychosupport.com</a>.</p> <p>Kind regards,<br /><strong>E-Psycho Support Team</strong></p>`;
		} else if (status === "expired") {
			subject = `Appointment Expired – Action Needed`;
			message = `<p>Dear ${appointment?.Student?.name},</p> <p> Your appointment request with <strong>${appointment?.Counsellor?.name}</strong> could not be confirmed in time and has expired. </p> <p><strong>Date & Time:</strong> ${appointment?.datetime}</p> <p><strong>Status:</strong> Expired</p> <p> To proceed, please create a new appointment through your account. </p> <p>If you need help, contact <a href="mailto:support@epsychosupport.com">support@epsychosupport.com</a>.</p> <p>Regards,<br /><strong>E-Psycho Support Team</strong></p>`;
		} else if (status === "completed") {
			subject = `Your Appointment Has Been Completed – E-Psycho Support`;
			message = `<p>Dear ${appointment?.Student?.name},</p> <p> This email confirms that your appointment with <strong>${appointment?.Counsellor?.name}</strong> has been completed. </p> <p><strong>Date & Time:</strong> ${appointment?.datetime}</p> <p><strong>Status:</strong> Completed</p> <p> We hope the session was helpful. You may schedule another appointment anytime through the platform. </p> <p style="font-size:13px; color:#555;"> If you require immediate assistance, please contact emergency services. </p> <p>With care,<br /><strong>E-Psycho Support Team</strong></p>`;
		}

		await step.run("send-booking-status-changed-email", async () => {
			const user = appointment.Student;
			await sendBookingGeneratedMail(user, subject, message);
		});
		return { success: true };
	},
);

module.exports = {
	bookingGenerated,
  bookingConfirmed,
  bookingStatusChanged
};
