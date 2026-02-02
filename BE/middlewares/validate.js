const { body, validationResult } = require("express-validator");

const regstrationSchema = [
	body("name").isLength({ min: 2 }).withMessage("Name required."),
	body("email").isEmail().withMessage("Valid email required."),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password length min 6 characters."),
];

const loginSchema = [
	body("email").isEmail().withMessage("Valid email required."),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password length min 6 characters."),
];

const assessmentSchema = [
	body("type")
		.isIn(["PHQ9", "GAD7", "GHQ"])
		.withMessage("Invalid assessment type."),
	body("answers").custom((value, { req }) => {
		const answers = [...value];
		let valid = true;
		if (req.body.type === "PHQ9") {
			valid =
				Array.isArray(answers) &&
				answers.length === 9 &&
				answers.every((ans) => Number.isInteger(ans) && ans >= 0 && ans <= 3);
		} else if (req.body.type === "GAD7") {
			valid =
				Array.isArray(answers) &&
				answers.length === 7 &&
				answers.every((ans) => Number.isInteger(ans) && ans >= 0 && ans <= 3);
		} else if (req.body.type === "GHQ") {
			valid =
				Array.isArray(answers) &&
				answers.length === 12 &&
				answers.every((ans) => Number.isInteger(ans) && ans >= 0 && ans <= 3);
		}
		if (!valid) {
			throw new Error("Invalid answers for the selected assessment type");
		}
		return true;
	}),
];

const handleValidationResult = (req, res, next) => {
	const err = validationResult(req);
	if (!err.isEmpty())
		return res.status(422).json({
			errors: err.array(),
		});
	return next();
};

module.exports = {
	regstrationSchema,
	loginSchema,
	assessmentSchema,
	handleValidationResult,
};
