function generateTimeSlots(startTime, endTime, slotDuration) {
	console.log(startTime, endTime, slotDuration);
	const slots = [];
	let start =
		parseInt(startTime?.toString()?.slice(0, 2)) * 60 +
		parseInt(startTime?.toString()?.slice(3));
	const end =
		parseInt(endTime?.toString()?.slice(0, 2)) * 60 +
		parseInt(endTime?.toString()?.slice(3));
	console.log("Start in minutes:", start, "End in minutes:", end);

	while (start + slotDuration <= end) {
		const h = String(Math.floor(start / 60)).padStart(2, "0");
		const m = String(start % 60).padStart(2, "0");
		slots.push(`${h}:${m}`);
		start += slotDuration;
	}

	return slots;
}

module.exports = generateTimeSlots;
