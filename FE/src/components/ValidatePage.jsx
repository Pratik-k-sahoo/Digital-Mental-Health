export default function ValidatePage({
	header = "Please wait",
	message = "We are verifying your session. This won’t take long.",
}) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="flex flex-col items-center space-y-6 rounded-2xl bg-white p-10 shadow-lg">
				<div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

				<div className="text-center">
					<h1 className="text-xl font-semibold text-gray-800">{header}</h1>
					<p className="mt-2 text-sm text-gray-500">
						{message}
					</p>
				</div>
			</div>
		</div>
	);
}
