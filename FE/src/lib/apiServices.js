import { redirect } from "react-router";
import api from "./axiosBase";

export async function createUser(credentials) {
	try {
		const response = await api.post(
			`/${import.meta.env.VITE_USER_URL}/register`,
			credentials,
		);

		if (response?.status !== 201) {
			throw new Error(response?.data?.message || "Failed to create a account.");
		}
		return response?.data;
	} catch (error) {
		throw new Error(error?.message || "Something went wrong.");
	}
}

export async function loginUser(credentials) {
	try {
		const response = await api.post(
			`/${import.meta.env.VITE_USER_URL}/login`,
			credentials,
		);

		if (response?.status !== 201) {
			throw new Error(
				response?.data?.message || "Failed to login into the account.",
			);
		}
		return response?.data;
	} catch (error) {
		throw new Error(
			error?.response?.data?.message ||
				error?.data?.message ||
				error?.message ||
				"Something went wrong.",
		);
	}
}

export async function updateUser(credentials) {
	try {
		const response = await api.patch(
			`/${import.meta.env.VITE_USER_URL}/update`,
			credentials,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to update the account.",
			);
		}
		return response?.data;
	} catch (error) {
		throw new Error(
			error?.response?.data?.message ||
				error?.data?.message ||
				error?.message ||
				"Something went wrong.",
		);
	}
}

export async function resetUser(credentials) {
	try {
		const response = await api.post(
			`/${import.meta.env.VITE_USER_URL}/forget`,
			credentials,
		);

		if (response?.status !== 200) {
			throw new Error(response?.data?.message || "Failed to reset password.");
		}
		return response?.data;
	} catch (error) {
		throw new Error(
			error?.response?.data?.message ||
				error?.data?.message ||
				error?.message ||
				"Something went wrong.",
		);
	}
}

export async function createAssessment(credentials) {
	try {
		const response = await api.post(
			`/${import.meta.env.VITE_ASSESSMENT_URL}/create`,
			credentials,
		);

		if (response?.status !== 201) {
			throw new Error(
				response?.data?.message || "Failed to save the assessment.",
			);
		}
		return response?.data;
	} catch (error) {
		throw new Error(
			error?.response?.data?.message ||
				error?.data?.message ||
				error?.message ||
				"Something went wrong.",
		);
	}
}

export async function fetchAssessmentHistory() {
	try {
		const response = await api.get(
			`/${import.meta.env.VITE_ASSESSMENT_URL}/my-assessments`,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to retrieve the assessments.",
			);
		}

		return response?.data?.assessments;
	} catch (error) {
		throw new Error(
			error?.response?.data?.message ||
				error?.data?.message ||
				error?.message ||
				"Something went wrong.",
		);
	}
}

export async function clearAssessmentHistory() {
	try {
		const response = await api.delete(
			`/${import.meta.env.VITE_ASSESSMENT_URL}/clear`,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to clear the assessments.",
			);
		}

		return response?.data;
	} catch (error) {
		throw new Error(
			error?.response?.data?.message ||
				error?.data?.message ||
				error?.message ||
				"Something went wrong.",
		);
	}
}

export async function fetchCounsellors() {
	try {
		const response = await api.get(
			`/${import.meta.env.VITE_APPOINTMENT_URL}/counsellors/available`,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to fetch the counsellors.",
			);
		}
		return response?.data?.counsellors;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function fetchAvailableSlots(counsellorId, date) {
	try {
		const response = await api.get(
			`/${
				import.meta.env.VITE_APPOINTMENT_URL
			}/slots?counsellorId=${counsellorId}&date=${date}`,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to fetch the available slots.",
			);
		}

		return response?.data?.slots;
	} catch (error) {
		throw new Error(
			error?.response?.data?.message ||
				error?.data?.message ||
				error?.message ||
				"Something went wrong.",
		);
	}
}

export async function bookAppointment(credentials) {
	try {
		const response = await api.post(
			`/${import.meta.env.VITE_APPOINTMENT_URL}`,
			credentials,
		);

		if (response?.status !== 201) {
			throw new Error(
				response?.data?.message || "Failed to book the appointment.",
			);
		}
		return response?.data;
	} catch (error) {
		throw new Error(
			error?.response?.data?.message ||
				error?.data?.message ||
				error?.message ||
				"Something went wrong.",
		);
	}
}

export async function confirmBooking(qr_token) {
	try {
		const response = await api.get(
			`/${import.meta.env.VITE_APPOINTMENT_URL}/confirm/${qr_token}`,
		);

		if (response.status === 410) {
			redirect("/booking");
		}

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to confirm the appointment.",
			);
		}

		return response?.data;
	} catch (error) {
		if (error?.status === 410) {
			const myError = new Error(error?.response?.data?.message);
			myError.status = error?.response?.status;
			throw myError;
		}

		throw new Error(
			error?.response?.data?.message ||
				error?.data?.message ||
				error?.message ||
				"Something went wrong.",
		);
	}
}

export async function fetchMyAppointments() {
	try {
		const response = await api.get(
			`/${import.meta.env.VITE_APPOINTMENT_URL}/me`,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to fetch the appointments.",
			);
		}

		return response?.data?.appointments;
	} catch (error) {
		throw new Error(
			error?.response?.data?.message ||
				error?.data?.message ||
				error?.message ||
				"Something went wrong.",
		);
	}
}

export async function fetchBookingDetailsByToken(token) {
	try {
		const response = await api.get(
			`/${import.meta.env.VITE_APPOINTMENT_URL}/details/${token}`,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to fetch the appointment details.",
			);
		}

		return response?.data?.appointment;
	} catch (error) {
		throw new Error(
			error?.response?.data?.message ||
				error?.data?.message ||
				error?.message ||
				"Something went wrong.",
		);
	}
}

export async function fetchBookingStatusByToken(token) {
	try {
		const response = await api.get(
			`/${import.meta.env.VITE_APPOINTMENT_URL}/status/${token}`,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to fetch the booking status.",
			);
		}

		return response?.data;
	} catch (error) {
		throw new Error(
			error?.response?.data?.message ||
				error?.data?.message ||
				error?.message ||
				"Something went wrong.",
		);
	}
}

export async function cancelBooking(token) {
	try {
		const response = await api.put(
			`/${import.meta.env.VITE_APPOINTMENT_URL}/cancel/${token}`,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to cancel the booking.",
			);
		}

		return response?.data;
	} catch (error) {
		throw new Error(
			error?.response?.data?.message ||
				error?.data?.message ||
				error?.message ||
				"Something went wrong.",
		);
	}
}

export async function createResource(credentials) {
	try {
		const response = await api.post(
			`/${import.meta.env.VITE_RESOURCE_URL}`,
			credentials,
		);

		if (response?.status !== 201) {
			throw new Error(
				response?.data?.message || "Failed to create the resource.",
			);
		}

		return response?.data?.resources;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function createResourceUsage(credentials) {
	try {
		const response = await api.post(
			`/${import.meta.env.VITE_RESOURCE_URL}/usage`,
			credentials,
		);

		if (response?.status !== 201) {
			throw new Error(
				response?.data?.message || "Failed to create the resource usage.",
			);
		}
		return response?.data;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function fetchResources() {
	try {
		const response = await api.get(`/${import.meta.env.VITE_RESOURCE_URL}`);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to fetch the resources.",
			);
		}

		return response?.data?.resources;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function updateResource({ id, credentials }) {
	try {
		const response = await api.patch(
			`/${import.meta.env.VITE_RESOURCE_URL}/${id}`,
			credentials,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to update the resources.",
			);
		}

		return response?.data?.resources;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function deleteResource({ id }) {
	try {
		const response = await api.delete(
			`/${import.meta.env.VITE_RESOURCE_URL}/${id}`,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to delete the resources.",
			);
		}

		return response?.data?.resources;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function fetchOverviewData() {
	try {
		const overview = await api.get(
			`/${import.meta.env.VITE_ADMIN_URL}/overview`,
		);

		return overview?.data?.data;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function fetchAllUsers() {
	try {
		const response = await api.get(`/${import.meta.env.VITE_ADMIN_URL}/users`);

		if (response?.status !== 200) {
			throw new Error(response?.data?.message || "Failed to fetch the users.");
		}

		return response?.data?.users;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function fetchAllResources() {
	try {
		const response = await api.get(
			`/${import.meta.env.VITE_ADMIN_URL}/resources`,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to fetch the resources.",
			);
		}

		return response?.data?.resources;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function fetchAllAppointments() {
	try {
		const response = await api.get(
			`/${import.meta.env.VITE_ADMIN_URL}/appointments`,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to fetch the appointments.",
			);
		}
		return response?.data?.appointments;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function fetchAllAssessments() {
	try {
		const response = await api.get(
			`/${import.meta.env.VITE_ADMIN_URL}/assessments`,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to fetch the assessments.",
			);
		}
		return response?.data?.assessments;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function fetchSeverityStats() {
	try {
		const response = await api.get(
			`/${import.meta.env.VITE_ASSESSMENT_URL}/severity`,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to fetch the severity stats.",
			);
		}
		return response?.data?.data;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function fetchTopResources(data) {
	try {
		const response = await api.get(
			`/${import.meta.env.VITE_RESOURCE_URL}/top?range=${data}`,
		);
		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to fetch the top resources.",
			);
		}
		return response?.data?.data;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function validateToken() {
	try {
		const response = await api.get(`/${import.meta.env.VITE_USER_URL}/auth`);

		if (response?.status === 404 && !response?.data?.user) {
			const myError = new Error("Session Expires. Please login again.");
			myError.status = 401;
			throw myError;
		}

		return response?.data?.user;
	} catch (error) {
		throw new Error(
			error?.response?.data?.message ||
				error?.data?.message ||
				error?.message ||
				"Something went wrong.",
		);
	}
}

export async function updateBookingStatus({ id, updatedStatus }) {
	try {
		const response = await api.patch(
			`/${import.meta.env.VITE_APPOINTMENT_URL}/${id}/status`,
			{ status: updatedStatus },
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to update the booking status.",
			);
		}
		return response?.data;
	} catch (error) {
		throw new Error(
			error?.response?.data?.message ||
				error?.data?.message ||
				error?.message ||
				"Something went wrong.",
		);
	}
}

export async function updateAlertThreshold(credentials) {
	try {
		const response = await api.patch(
			`/${import.meta.env.VITE_USER_URL}/threshold`,
			credentials,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to update alert threshold.",
			);
		}
		return response?.data;
	} catch (error) {
		throw new Error(error?.message || "Something went wrong.");
	}
}

export async function getAllPosts({ page, limit = 10 }) {
	try {
		const response = await api.get(`/${import.meta.env.VITE_FORUM_URL}/posts`, {
			params: { page, limit },
		});

		if (response?.status !== 200) {
			throw new Error(response?.data?.message || "Failed to fetch posts.");
		}
		return response?.data;
	} catch (error) {
		throw new Error(error?.message || "Something went wrong.");
	}
}

export async function addPost(credentials) {
	try {
		const response = await api.post(
			`/${import.meta.env.VITE_FORUM_URL}/post`,
			credentials,
		);

		if (response?.status !== 201) {
			throw new Error(response?.data?.message || "Failed to create a post.");
		}
		return response?.data;
	} catch (error) {
		throw new Error(error?.message || "Something went wrong.");
	}
}

export async function addComment({ credentials, id }) {
	try {
		const response = await api.post(
			`/${import.meta.env.VITE_FORUM_URL}/posts/${id}/comment`,
			credentials,
		);

		if (response?.status !== 201) {
			throw new Error(response?.data?.message || "Failed to add comment");
		}

		return response?.data;
	} catch (error) {
		throw new Error(error?.message || "Something went wrong.");
	}
}

export async function addLike({ id }) {
	try {
		const response = await api.post(
			`/${import.meta.env.VITE_FORUM_URL}/posts/${id}/like`,
			{},
		);

		if (response?.status !== 201) {
			throw new Error(response?.data?.message || "Failed to drop a like");
		}
		return response;
	} catch (error) {
		throw new Error(error?.message || "Something went wrong.");
	}
}

export async function addBookmark({ id }) {
	try {
		const response = await api.post(
			`/${import.meta.env.VITE_FORUM_URL}/posts/${id}/bookmark`,
			{},
		);

		if (response?.status !== 201) {
			throw new Error(response?.data?.message || "Failed to drop a like");
		}
		return response;
	} catch (error) {
		throw new Error(error?.message || "Something went wrong.");
	}
}

export async function getPostsWithComments({ id }) {
	try {
		const response = await api.get(
			`/${import.meta.env.VITE_FORUM_URL}/posts/${id}`,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to fetch posts with comments.",
			);
		}
		return response?.data;
	} catch (error) {
		throw new Error(error?.message || "Something went wrong.");
	}
}

export async function flagPost({ credentials, id }) {
	try {
		const response = await api.post(
			`/${import.meta.env.VITE_FORUM_URL}/posts/${id}/flag`,
			credentials,
		);

		if (response?.status !== 201) {
			throw new Error(response?.data?.message || "Failed to flag post.");
		}
		return response?.data;
	} catch (error) {
		throw new Error(error?.message || "Something went wrong.");
	}
}

export async function flagComment({ credentials, id }) {
	try {
		const response = await api.post(
			`/${import.meta.env.VITE_FORUM_URL}/comments/${id}/flag`,
			credentials,
		);

		if (response?.status !== 201) {
			throw new Error(response?.data?.message || "Failed to flag comment.");
		}
		return response?.data;
	} catch (error) {
		throw new Error(error?.message || "Something went wrong.");
	}
}

export async function updatePostStatus({ credentials, id }) {
	try {
		const response = await api.patch(
			`/${import.meta.env.VITE_FORUM_URL}/posts/${id}/status`,
			credentials,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to update post status.",
			);
		}
		return response?.data;
	} catch (error) {
		throw new Error(error?.message || "Something went wrong.");
	}
}

export async function togglePostLock({ credentials, id }) {
	try {
		const response = await api.patch(
			`/${import.meta.env.VITE_FORUM_URL}/posts/${id}/lock/${credentials}`,
		);

		if (response?.status !== 200) {
			throw new Error(response?.data?.message || "Failed to toggle post lock.");
		}

		return response.data;
	} catch (error) {
		throw new Error(error?.message || "Something went wrong.");
	}
}

export async function updateCommentStatus({ credentials, id }) {
	try {
		const response = await api.get(
			`/${import.meta.env.VITE_FORUM_URL}/comments/${id}/status`,
			credentials,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to update comment status.",
			);
		}

		return response?.data;
	} catch (error) {
		throw new Error(error?.message || "Something went wrong.");
	}
}

export async function editPost({ credentials, id }) {
	try {
		const response = await api.patch(
			`/${import.meta.env.VITE_FORUM_URL}/post/${id}`,
			credentials,
		);

		if (response?.status !== 200) {
			throw new Error(response?.data?.message || "Failed to edit a post.");
		}

		return response?.data;
	} catch (error) {
		throw new Error(error?.message || "Something went wrong.");
	}
}

export async function getAllReportedPosts() {
	try {
		const response = await api.get(
			`/${import.meta.env.VITE_ADMIN_URL}/reported-posts`,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to fetch the reported posts.",
			);
		}
		return response?.data?.posts;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function reviewPost({ credentials, id }) {
	try {
		const response = await api.patch(
			`/${import.meta.env.VITE_ADMIN_URL}/posts/${id}/review`,
			credentials,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to review the reported posts.",
			);
		}
		return response?.data?.post;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function reviewReport(id) {
	try {
		const response = await api.patch(
			`/${import.meta.env.VITE_ADMIN_URL}/reported-posts/${id}/review`,
			{},
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to resolve the reports.",
			);
		}
		return response?.data?.posts;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function getAllReportedComments() {
	try {
		const response = await api.get(
			`/${import.meta.env.VITE_ADMIN_URL}/reported-comments`,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to fetch the reported comments.",
			);
		}
		return response?.data?.comments;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function reviewComment({ credentials, id }) {
	try {
		const response = await api.patch(
			`/${import.meta.env.VITE_ADMIN_URL}/comments/${id}/review`,
			credentials,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to review the reported comments.",
			);
		}
		return response?.data?.post;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function reviewCommentReport(id) {
	try {
		const response = await api.patch(
			`/${import.meta.env.VITE_ADMIN_URL}/reported-comments/${id}/review`,
			{},
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to resolve the reports.",
			);
		}
		return response?.data?.posts;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function getPosts() {
	try {
		const response = await api.get(`/${import.meta.env.VITE_ADMIN_URL}/posts`);

		if (response?.status !== 200) {
			throw new Error(response?.data?.message || "Failed to fetch the posts.");
		}
		return response?.data?.posts;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function getPeerApplication(id) {
	try {
		const response = await api.get(
			`/${import.meta.env.VITE_VOLUNTEER_URL}/${id}`,
		);
		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to fetch the application.",
			);
		}
		return response?.data?.application || [];
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function createPeerApplication() {
	try {
		const response = await api.post(`/${import.meta.env.VITE_VOLUNTEER_URL}`);
		if (response?.status !== 201) {
			throw new Error(
				response?.data?.message || "Failed to create the application.",
			);
		}
		return response?.data?.application;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function saveApplicationStep({
	applicationId,
	stepNumber,
	credentials,
}) {
	try {
		const response = await api.put(
			`/${import.meta.env.VITE_VOLUNTEER_URL}/${applicationId}/step/${stepNumber}`,
			credentials,
		);
		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to save the application.",
			);
		}
		return response?.data?.application;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function submitApplication({ applicationId }) {
	try {
		const response = await api.post(
			`/${import.meta.env.VITE_VOLUNTEER_URL}/${applicationId}/submit`,
		);
		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to submit the application.",
			);
		}
		return response?.data?.message;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function cancelApplication({ applicationId }) {
	try {
		const response = await api.delete(
			`/${import.meta.env.VITE_VOLUNTEER_URL}/${applicationId}`,
		);
		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to cancel the application.",
			);
		}
		return response?.data?.message;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function fetchAppliedPeers() {
	try {
		const response = await api.get(
			`/${import.meta.env.VITE_ADMIN_URL}/applied-peers`,
			{},
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to fetch applied peers",
			);
		}
		return response?.data?.applications;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function fetchAIAnalysis(id) {
	try {
		const response = await api.get(
			`/${import.meta.env.VITE_ADMIN_URL}/ai-analysis/${id}`,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to analyse application",
			);
		}
		return response?.data?.result;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}

export async function updatePeerApplicationStatus({ id, status }) {
	try {
		const response = await api.patch(
			`/${import.meta.env.VITE_ADMIN_URL}/applied-peer/${id}/review/${status}`,
		);

		if (response?.status !== 200) {
			throw new Error(
				response?.data?.message || "Failed to update application status",
			);
		}
		return response?.data?.application;
	} catch (error) {
		throw new Error(error || "Something went wrong.");
	}
}
