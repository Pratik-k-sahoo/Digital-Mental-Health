import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router";

const ScrollToHash = () => {
	const { hash } = useLocation();

	useEffect(() => {
		if (hash) {
			const elem = document.getElementById(hash.replace("#", ""));
			if (elem) {
				elem.scrollIntoView({ behavior: "smooth" });
				window.history.replaceState(null, "", window.location.pathname);
			}
		}
	}, [hash]);
	return null;
};

export default ScrollToHash;
