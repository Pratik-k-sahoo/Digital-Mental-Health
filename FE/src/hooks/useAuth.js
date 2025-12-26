import { validateToken } from "@/lib/apiServices";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const useAuth = (enabled = true) => {
	return useQuery({
		queryKey: ["auth", "me", "user"],
		queryFn: validateToken,
		enabled,
    retry: false
	});
};

export default useAuth;
