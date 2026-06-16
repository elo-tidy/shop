export function estimatedDelivery(createdAt: Date , delivery_time: string): string |null {

	if (!createdAt || delivery_time == null) {
		return null
	}

	const options: Intl.DateTimeFormatOptions = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	// Current date
	const baseDate: Date = new Date(createdAt);

	// Number of days to be delivered
	const processing: number = 2;
	const deliveryDaysInfo: string | undefined = delivery_time;
	const extractDeliveryDays: number[] =
		deliveryDaysInfo?.match(/\d+/g)?.map((n) => parseInt(n, 10)) || [];
	const deliveryMaxDays: number | null =
		extractDeliveryDays.length > 0
			? Math.max(...extractDeliveryDays)
			: null;
	const deliveryDay: number = deliveryMaxDays ?? 0 + processing;

	const newDate: Date = new Date(baseDate);
	let daysAdded: number = 0;
	while (daysAdded < deliveryDay) {
		newDate.setDate(newDate.getDate() + 1);
		const dayOfWeek = newDate.getDay();
		if (dayOfWeek !== 0 && dayOfWeek !== 6) {
			daysAdded++;
		}
	}
	return newDate.toLocaleDateString();
}
export function convertDateFRtoISO(dateFR: string): string {
	const [day, month, year] = dateFR.split("/");
	return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function convertISOtoDateFR(dateISO: string | Date): string {
	const date = typeof dateISO === "string" ? new Date(dateISO) : dateISO;
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}
