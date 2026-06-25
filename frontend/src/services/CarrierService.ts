// Types
import type {
    DeliveryMode,
    ShippingMode,
    Transporter,
} from "@shared/types/ShippingMode";
// Composables
import { estimatedDelivery } from "@shared/composables/useDeliveryEstimation";
// Services
import { fetchShippingOptions } from "@/services/ShippingOptions";

export async function getCarrierDetails(
    carrierId:
        ShippingMode["delivery_modes"][number]["transporters"][number]["id"],
): Promise<
    {
        deliveryMode: DeliveryMode["name"];
        deliveryDate: String | null;
        transporter: Transporter;
    }
> {
    const carriers: ShippingMode = await fetchShippingOptions();
    for (const deliveryMode of carriers.delivery_modes) {
        const found = deliveryMode.transporters.find(
            (carrier) => carrier.id === carrierId,
        );
        if (found) {
            const deliveryDate = estimatedDelivery(
                new Date(),
                found.estimated_delivery_time,
            );
            return {
                deliveryMode: deliveryMode.name,
                deliveryDate: deliveryDate,
                transporter: found,
            };
        }
    }

    throw new Error(`Transporteur inconnu : ${carrierId}`);
}
