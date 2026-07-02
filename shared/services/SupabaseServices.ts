// Types
import type { Order, OrderDb } from "@shared/types/Order";
import type { Database } from "@shared/types/database.ts";
import type { Category } from "@shared/types/Categories.ts";
// Utils
import { supabase } from "@/utils/supabase";
import { numberWithTwoDecimals } from "@shared/utils/maths";

export async function sendMagicLink(email: string): Promise<void> {
	const { error } = await supabase.auth.signInWithOtp({ email });
	if (error) {
		throw new Error(error.message);
	}
}

export async function getUserProfile() {
	const { data, error } = await supabase.auth.getSession();
	if (error || !data) {
		throw new Error("Utilisateur non connecté ou session invalide");
	}
	const userId = data?.session?.user.id;
	if (!userId) {
		throw new Error("Utilisateur non connecté ou session invalide");
	}

	const { data: profiles, error: profilesError } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", userId)
		.single();

	if (profilesError || !profiles) throw new Error("Profil introuvable");

	return { profiles, profilesError };
}

export async function isAdmin(): Promise<boolean> {
	const { profiles: sessionData, profilesError: sessionError } =
		await getUserProfile();
	if (sessionError || !sessionData) {
		throw new Error("Utilisateur non connecté ou session invalide");
	}

	const { data, error } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", sessionData.id)
		.single();
	if (error) throw error;

	return data.role === "admin" ? true : false;
}

export async function signOutService(): Promise<void> {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
}

export const order_select_sql = `
  id,
  user_id,
  cart_id,
  created_at,
  updated_at,
  total_price,
  payment_method,
  payment_status,
  delivery_status,
  delivery_carrier,
  delivery_date,
  delivery_price,
  products_price,
  payment_ID,
  stripe_event_id,
  cart:carts (
    id,
    products:carts_products (
      id,
      cart_id,
      product_id,
      title,
      price,
      quantity,
      image,
      products:product_id (
        stock:product_stock (
          quantity
        )
      ),
      category,
      description
    )
  )
`;

const mapOrderData = (
	data: OrderDb | null,
): Order | null => {
	if (!data) return null;
	return {
		id: data.id,
		user_id: data.user_id,
		cart_id: data.cart_id ?? "",
		created_at: data.created_at,
		updated_at: data.updated_at,
		total_price: Number(numberWithTwoDecimals(data.total_price)),
		payment_method: data.payment_method,
		payment_status: data.payment_status,
		delivery_status: data.delivery_status,
		delivery_carrier: data.delivery_carrier,
		delivery_date: data.delivery_date,
		delivery_price: Number(numberWithTwoDecimals(data.delivery_price)),
		products_price: Number(numberWithTwoDecimals(data.products_price)),
		payment_ID: data.payment_ID,
		stripe_event_id: data.stripe_event_id,
		cart: {
			id: data.cart.id,
			products: data.cart.products.map((p) => ({
				id: p.product_id,
				title: p.title ?? "",
				price: p.price,
				description: p.description ?? "",
				image: p.image ?? "",
				category: p.category as Category,
				quantity: p.quantity,
				stock: p.products?.stock?.quantity ?? 0,
			})),
		},
	};
};

export async function updatePaymentOrderService(
	orderId: Order["id"],
	paymentId: Order["payment_ID"],
): Promise<Order | null> {
	const orderData = await getOrderService(undefined, orderId);
	if (!orderData) return null;

	const { data, error } = await supabase
		.from("orders")
		.update({ payment_status: "paid", payment_ID: paymentId! })
		.eq("id", orderData.id!)
		.select(
			`
			id,
			user_id,
			cart_id,
			created_at,
			updated_at,
			total_price,
			payment_method,
			payment_status,
			delivery_status,
			delivery_carrier,
			delivery_date,
			delivery_price,
			products_price,
			payment_ID,
			stripe_event_id,
			cart:carts (
				id,
				products:carts_products (
					id,
					cart_id,
					product_id,
					title,
					price,
					quantity,
					image,
					products:product_id (
						stock:product_stock (
							quantity
						)
					),
					category,
					description
				)
			)
		`,
		)
		.single();
	if (error) {
		console.error(
			"Erreur lors de la mise à jour du statut de paiement :",
			error,
		);
		return null;
	}

	const mappedData = mapOrderData(data);
	if (!mappedData) return null;

	return mappedData;
}

export async function getOrderService(
	payment_status?: "paid",
	orderId?: Order["id"],
): Promise<Order | null> {
	// Get last order with id if given
	if (orderId) {
		const { data, error } = await supabase
			.from("orders")
			.select(order_select_sql)
			.eq("id", orderId)
			.in(
				"payment_status",
				payment_status === "paid" ? ["paid"] : ["pending", "failed"],
			)
			.limit(1)
			.maybeSingle();
		if (error) throw error;
		return data as Order | null;
	}

	// Check user session
	const { profiles: sessionData, profilesError: sessionError } =
		await getUserProfile();
	if (sessionError || !sessionData) {
		throw new Error("Utilisateur non connecté ou session invalide");
	}
	// const userId = sessionData?.session?.user.id!;

	// select order and return order
	const { data, error } = await supabase
		.from("orders")
		.select(order_select_sql)
		.eq("user_id", sessionData.id)
		.in(
			"payment_status",
			payment_status === "paid" ? ["paid"] : ["pending", "failed"],
		)
		.order("created_at", { ascending: false })
		.limit(1)
		.maybeSingle();

	if (error) throw error;
	const mappedData = mapOrderData(data);
	if (!mappedData) return null;

	return mappedData;
}
