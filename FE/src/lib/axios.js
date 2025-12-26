import api from "./axiosBase";
import { toast } from "sonner";
import { queryClient } from "./queryClient";

let isRedirect = false;

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error?.response?.status === 401) {
			console.log(error);
			const isOnLoginPage = window.location.pathname === "/login";

			if (!isRedirect && !isOnLoginPage) {
				isRedirect = true;
				toast.error("Session expired. Please login again.");
				queryClient.clear();
				localStorage.clear();
				sessionStorage.clear();
				window.location.replace("/login");
			}
		}

		return Promise.reject(error);
	}
);
