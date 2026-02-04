const { NonRetriableError } = require("inngest");
const { User } = require("../../models");
const { inngest } = require("../client.js");
const { sendLoginMail } = require("../../services/mailer.js");

const onUserSignup = inngest.createFunction(
	{ id: "on-user-create", retries: 2 },
	{ event: "user/create" },
	async ({ event, step }) => {
		try {
			const { user } = event.data;
			const mailSubject =
				user?.role === "peer_volunteer"
					? "- Peer Volunteer Access"
					: user?.role === "counsellor"
						? "- Counsellor Account"
						: user?.role === "admin"
							? "- Admin Access"
							: "";

			const mailMessage =
				user?.role === "peer_volunteer"
					? `<p>Dear ${user.name},</p> <p> Thank you for joining E-Psycho Support as a <strong>Peer Volunteer</strong>. Your role is vital in building a compassionate and trustworthy community. </p> <h4>Your Responsibilities</h4> <ul> <li>Provide empathetic listening, not professional advice</li> <li>Maintain clear emotional boundaries</li> <li>Encourage professional help when necessary</li> </ul> <h4>Conduct & Language Policy (Strict)</h4> <ul> <li>No mentally abusive, dismissive, or shaming language</li> <li>No presenting yourself as a therapist or clinician</li> <li>No emotional dependency or manipulation</li> </ul> <p style="color:#a94442;"> Violations may lead to immediate review or removal of volunteer access. </p> <h4>Disclaimer</h4> <p style="font-size:13px; color:#555;"> Peer support is not therapy. You are not responsible for diagnosing, treating, or managing crises. Escalation protocols must be followed. </p> <p> If you feel overwhelmed or need guidance, contact <a href="mailto:support@epsychosupport.com">support@epsychosupport.com</a>. </p> <p style="margin-top:24px;"> With appreciation,<br /> <strong>The E-Psycho Support Team</strong><br /> <em style="color:#777;">Empathy • Responsibility • Integrity</em> </p>
`
					: user?.role === "student"
						? `<p>Dear ${user.name},</p> <p> We’re glad you’ve taken a step toward prioritizing your mental and emotional wellbeing. E-Psycho Support is a safe space built around care, understanding, and respect. </p> <h4>Your Account Details</h4> <ul> <li><strong>Name:</strong> ${user.name}</li> <li><strong>Email:</strong> ${user.email}</li> <li><strong>Role:</strong> Student</li> <li><strong>Department:</strong> ${user.department}</li> <li><strong>Passing Year:</strong> ${user.year}</li> </ul> <p style="font-size:13px; color:#555;"> For your security, your password is encrypted and never visible to anyone. </p> <h4>Community Conduct & Safety</h4> <p> To keep this platform safe for everyone, please: </p> <ul> <li>Use respectful and non-abusive language</li> <li>Avoid harassment, hate speech, or shaming</li> <li>Respect personal boundaries and lived experiences</li> </ul> <p style="color:#a94442;"> Mentally abusive or harmful language may result in moderation or account restrictions. </p> <h4>Important Disclaimer</h4> <p style="font-size:13px; color:#555;"> E-Psycho Support offers emotional and peer support and does not replace professional medical or emergency care. If you are in immediate danger, contact local emergency services right away. </p> <p> Need help? Contact us at <a href="mailto:support@epsychosupport.com">support@epsychosupport.com</a>. </p> <p style="margin-top:24px;"> Warm regards,<br /> <strong>The E-Psycho Support Team</strong><br /> <em style="color:#777;">Empathy • Safety • Confidentiality</em> </p>
`
						: `<p>Dear ${user.name},</p> <p> We are honored to welcome you as a <strong style="text-transform: capitalize;">${user.role}</strong> on E-Psycho Support. Your role carries professional and ethical responsibility. </p> <h4>Professional Expectations</h4> <ul> <li>Use empathetic, neutral, and respectful language</li> <li>Maintain confidentiality and ethical standards</li> <li>Avoid judgmental, stigmatizing, or abusive communication</li> </ul> <h4>Zero-Tolerance Policy</h4> <p style="color:#a94442;"> Any form of emotional abuse, discrimination, or boundary violation will result in immediate investigation and possible suspension. </p> <h4>Professional Disclaimer</h4> <p style="font-size:13px; color:#555;"> You must practice within your qualifications and refer users to emergency or specialized services when required. </p> <p> For technical or ethical concerns, contact <a href="mailto:support@epsychosupport.com">support@epsychosupport.com</a>. </p> <p style="margin-top:24px;"> Sincerely,<br /> <strong>The E-Psycho Support Team</strong><br /> <em style="color:#777;">Ethics • Care • Accountability</em> </p>
`;
			await step.run("send-welcome-email", async () => {
				const subject = mailSubject;
				const message = mailMessage;
				await sendLoginMail(user, subject, message);
			});
			return { success: true };
		} catch (error) {
			console.error("❌ Error running step: ", error.message);
			return { success: false };
		}
	},
);

module.exports = {
	onUserSignup,
};
