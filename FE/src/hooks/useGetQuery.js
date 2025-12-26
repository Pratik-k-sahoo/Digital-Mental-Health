import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useSelector } from "react-redux";

const useGetQuery = (options) => {
	const { user } = useSelector((state) => state.auth);

	return useQuery({
		...options,
		enabled: !!user?.id && (options?.enabled ?? true),
		queryKey: [...(options?.queryKey ?? []), user?.id],
	});
};

export default useGetQuery;
