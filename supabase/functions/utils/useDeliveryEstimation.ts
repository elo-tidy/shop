export function estimatedDelivery(transporter_estimated_delivery_time: string): string {
  const processing = 2;

  const extractDeliveryDays =
    transporter_estimated_delivery_time
      ?.match(/\d+/g)
      ?.map((n) => Number(n)) || [];

  const deliveryMaxDays =
    extractDeliveryDays.length > 0 ? Math.max(...extractDeliveryDays) : 0;

  const totalBusinessDays = deliveryMaxDays + processing;

  let daysAdded = 0;
  let cursor = new Date();

  while (daysAdded < totalBusinessDays) {
    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) {
      daysAdded++;
    }
  }
  
  return cursor.toISOString().split("T")[0];
}