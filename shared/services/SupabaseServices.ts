// Types
import type {CartType, Order, OrderDb} from "@/types/Cart";
import type {productCatalog} from "@/types/Product";
import type {Database} from "../types/database.ts";

// Utils
import {supabase} from "@/utils/supabase";
import {numberWithTwoDecimals, formatPriceWithTwoDecimals} from "@/utils/maths";

export async function sendMagicLink(email: string): Promise<void> {
	const {error} = await supabase.auth.signInWithOtp({email});
	if (error) {
		throw new Error(error.message);
	}
}

export async function getUserProfile() {
	const {data, error} = await supabase.auth.getSession();
	if (error || !data) {
		throw new Error("Utilisateur non connecté ou session invalide");
	}
	return {data, error};
}

export async function isAdmin():Promise<boolean> {
	const {data: sessionData, error: sessionError} = await getUserProfile();
	if (sessionError || !sessionData) {
		throw new Error("Utilisateur non connecté ou session invalide");
	}
	const userId = sessionData?.session?.user.id!;

	const {data, error} = await supabase
		.from("profiles")
		.select("role")
		.eq("id", userId)
		.single()
	if (error) throw error;

	return data.role === "admin" ? true : false
}

export async function updateProfileService(
	userId: string,
	userName: string
): Promise<void> {
	const updates: Database["public"]["Tables"]["profiles"]["Update"] = {
		username: userName,
		updated_at: new Date().toISOString(),
	};
	const {error} = await supabase
		.from("profiles")
		.update(updates)
		.eq("id", userId);
	if (error) throw error;
}

export async function signOutService(): Promise<void> {
	const {error} = await supabase.auth.signOut();
	if (error) throw error;
}

export async function inserOrderService(
	product_list: CartType,
	carrierId: string,
	paymentIntentId: string
) {
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
`

const mapOrderData = (
	data: OrderDb | null
	): Order | null => {
	if (!data) return null

	return {
		id: data.id,
		user_id: data.user_id,
		cart_id: data.cart_id,
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
			title: p.title ?? '',
			price: p.price,
			description: p.description ?? '',
			image: p.image ?? '',
			category: p.category ?? '',
			quantity: p.quantity,
			stock: p.products?.stock?.quantity ?? 0,
		})),
		},
	}
}

export async function updatePaymentOrderService(
	orderId: Order["id"],
	paymentId: Order["payment_ID"]
): Promise<Order | null> {
	// retourne la commande mise à jour
	console.log("orderId", orderId);
	console.log("paymentId", paymentId);

	const orderData = await getOrderService(undefined,orderId);
	if (!orderData) return null;

	const {data, error} = await supabase
		.from("orders")
		.update({payment_status: "paid", payment_ID: paymentId!})
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
		`
		)
		.single();
	if (error) {
		console.error(
			"Erreur lors de la mise à jour du statut de paiement :",
			error
		);
		return null;
	}

	type OrderDb = typeof data



	const mappedData = mapOrderData(data);
	if (!mappedData) return null;

	return mappedData;
}

export async function deleteOrderFromBdd(
	OrderID: Order["id"]
): Promise<boolean> {
	// Récupérer la commande
	const orderData = await getOrderService( undefined, OrderID);
	
	if (!orderData || !orderData.id) {
		console.error("Commande introuvable pour l'ID :", OrderID);
		return false;
	}

	console.log("Suppression de la commande ID :", orderData.id);
	console.log("Suppression cart_id :", orderData.cart_id);

	if (!orderData.cart_id) {
		console.error("Panier introuvable pour orderID  :", OrderID);
		return false;
	}

	// Supprimer les produits liés au panier
	if (orderData.cart_id) {
	
		const {error: errorProducts} = await supabase
			.from("carts_products")
			.delete()
			.eq("cart_id", orderData.cart_id);

		if (errorProducts) {
			console.error(
				"Erreur de suppression des produits du panier :",
				errorProducts
			);
			return false;
		}
	} else {
		console.warn("Pas de cart_id associé, aucun produit à supprimer");
	}

	// Supprimer la commande
	if (orderData.id) {
		const {error: errorOrder} = await supabase
			.from("orders")
			.delete()
			.eq("id", orderData.id)
			.select(); // récupère la commande supprimée

		if (errorOrder) {
			console.error("Erreur de suppression de la commande :", errorOrder);
			return false;
		}
	} else {
		console.warn("Pas de commande associée à cet id");
	}

	// Supprimer le panier
	const {data, error: errorCart} = await supabase
		.from("carts")
		.delete()
		.eq("id", orderData.cart_id)
		.select(); // récupère la commande supprimée

	if (errorCart) {
		console.error("Erreur de suppression du panier en bdd :", errorCart);
		return false;
	}	

	console.log("Commande supprimée :", data);

	return true;
}

export async function getOrderService(
	payment_status?: "paid",
	orderId?: Order["id"]
): Promise<Order | null> {
	// Get last order with id if given
	if (orderId) {
		const {data, error} = await supabase
			.from("orders")
			.select(order_select_sql)
			.eq("id", orderId)
			.in("payment_status", payment_status === "paid" ? ["paid"] : ["pending", "failed"])
			.limit(1)
			.maybeSingle();
		if (error) throw error;
		return data as Order | null;
	}

	// Check user session
	const {data: sessionData, error: sessionError} = await getUserProfile();
	if (sessionError || !sessionData) {
		throw new Error("Utilisateur non connecté ou session invalide");
	}
	const userId = sessionData?.session?.user.id!;

	// select order and return order
	const {data, error} = await supabase
		.from("orders")
		.select(order_select_sql)
		.eq("user_id", userId)
		.in("payment_status", payment_status === "paid" ? ["paid"] : ["pending", "failed"])
		.order("created_at", {ascending: false})
		.limit(1)
		.maybeSingle();

	if (error) throw error;	
	const mappedData = mapOrderData(data);
	if (!mappedData) return null;

	return mappedData as Order;
}
