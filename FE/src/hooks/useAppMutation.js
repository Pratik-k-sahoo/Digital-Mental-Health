import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

const useAppMutation = (options = {}) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationFn: options?.mutationFn,
		onSuccess: (data, variables, context) => {
			options?.onSuccess?.(data, variables, context);

			if (options?.invalidateQueries)
				queryClient.invalidateQueries(options?.invalidateQueries);
		},
		onError: (error, variables, context) => {
			console.error(error);
			options.onError?.(error, variables, context);
		},
	});
};

export default useAppMutation;
