import { useDispatch, useSelector } from "react-redux";
import { setAnonymized } from "@/redux/slice/anonymizationSlice";

const useAnonymization = () => {
	const dispatch = useDispatch();
	const { isAnonymized } = useSelector((state) => state.anonymization);

	const anonymizeEmail = (email) => {
		if (!email) return "N/A";
		if (!isAnonymized) return email;

		const [local, domain] = email.split("@");
		if (!domain) return "***@***.***";

		const maskedLocal =
			local.charAt(0) + "***" + local.charAt(local.length - 1);

		const domainParts = domain.split(".");
		const maskedDomain = domainParts
			.map((part, i) => (i === domainParts.length - 1 ? part : "***"))
			.join(".");

		return `${maskedLocal}@${maskedDomain}`;
	};

	const anonymizeName = (name) => {
		if (!name) return "Not set";
		if (!isAnonymized) return name;

		return name
			.split(" ")
			.map((part) =>
				part.length <= 1 ? part : part.charAt(0) + "*".repeat(part.length - 1)
			)
			.join(" ");
	};

  return {
		isAnonymized,
		setIsAnonymized: (value) => dispatch(setAnonymized(value)),
		anonymizeEmail,
		anonymizeName,
	};
};

export default useAnonymization;
