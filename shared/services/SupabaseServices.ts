// Types
import type {CartType, InsertCartProduct, Order} from "@/typesold/Cart";
import type {Database, Tables, TablesInsert} from "@/typesold/supabase";
// import type { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'
// Stores
import {useCartStore} from "@/store/CartStore";
// Services
import {fetchShippingOptions} from "@/services/ShippingOptions";
// Composables
import {
	estimatedDelivery,
	convertDateFRtoISO,
} from "../composables/useDeliveryEstimation";
// Utils
import {supabase} from "@/utils/supabase";

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
	// Skip if no products to insert
	if (
		!product_list ||
		!product_list.products ||
		product_list.products.length === 0
	) {
		console.warn("Aucun produit à insérer, arrêt de l'insertion.");
		return;
	}

	// Current user session
	const {data: sessionData, error: sessionError} = await getUserProfile();
	if (sessionError || !sessionData) {
		throw new Error("Utilisateur non connecté ou session invalide");
	}
	const userId = sessionData?.session?.user.id!;

	// load last order if exists
	const {data: lastOrder, error: lastOrderError} = await supabase
		.from("orders")
		.select("id, cart_id")
		.eq("user_id", userId)
		.order("created_at", {ascending: false})
		.limit(1)
		.maybeSingle();

	if (lastOrderError) {
		console.error(
			"Erreur récupération dernière commande :",
			lastOrderError
		);
	}
	console.log(lastOrder);

	// Check if lastOrder already in bdd
	if (lastOrder && lastOrder.cart_id === product_list.id) {
		console.log("Commande déjà insérée pour ce panier, rien à faire.");
		return;
	}

	// Cart insertion in bdd
	const {data: newCart, error: errorCart} = await supabase
		.from("carts")
		.insert({user_id: userId})
		.select("id")
		.single();

	if (errorCart || !newCart) {
		console.error("Erreur création panier :", errorCart);
		throw new Error("Impossible de créer le panier");
	}

	const cartId = newCart.id;

	// Carrier details
	const carrierDetails = await getCarrierDetails(carrierId);
	if (!carrierDetails) {
		throw new Error("Impossible de récupérer les détails du transporteur");
	}

	// Insert cart's products
	const cart_products: InsertCartProduct[] = product_list.products.map(
		(product) => ({
			cart_id: cartId,
			product_id: product.id,
			title: product.title,
			price: product.price,
			description: product.description,
			image: product.image,
			category: product.category,
			quantity: product.quantity!,
		})
	);

	const {error: errorProducts} = await supabase
		.from("carts_products")
		.insert(cart_products);
	if (errorProducts) {
		console.error("Erreur ajout produits :", errorProducts);
		throw new Error("Impossible d'ajouter les produits au panier");
	}

	// Prices
	const cart = useCartStore();
	const totalPrice = cart.getOrderPrice;
	const productsPrice = cart.getCartTotalPrice;

	// Delivery details
	const isoDateStr = convertDateFRtoISO(estimatedDelivery());
	const deliveryDate = new Date(isoDateStr);
	if (isNaN(deliveryDate.getTime())) {
		throw new Error("Date de livraison invalide");
	}
	const isoStringDateOnly = deliveryDate.toISOString().split("T")[0];

	// Order bdd insertion
	const {data: newOrder, error: errorOrder} = await supabase
		.from("orders")
		.insert({
			/*id:"",
			user_id: userId,
			cart_id: cartId,
			total_price: totalPrice,
			delivery_carrier: carrierDetails.transporter.id,
			delivery_date: isoStringDateOnly,
			delivery_price: carrierDetails.transporter.price,
			products_price: productsPrice,
			payment_status: 1,
			payment_method: "Carte bancaire",*/
			cart_id: cartId,
			delivery_carrier: carrierDetails.transporter.id,
			delivery_date: isoStringDateOnly,
			delivery_price: carrierDetails.transporter.price,
			payment_method: "Carte bancaire",
			payment_status: 1,
			products_price: Number(productsPrice),
			total_price: Number(totalPrice),
			user_id: userId,
			payment_ID: paymentIntentId,
		} as Database["public"]["Tables"]["orders"]["Insert"])
		.select("id")
		.single();

	if (errorOrder) {
		console.error("Erreur création commande :", errorOrder);
		throw new Error("Impossible de créer la commande");
	}
}

/*export async function updatePaymentOrderService(
	orderId: Order["id"],
	paymentId: Order["payment_ID"]
): Promise<boolean> {
	console.log("orderId", orderId);
	console.log("paymentId", paymentId);
	// Get last order
	const orderData = await getOrderService(orderId);
	console.log("orderData", orderData);
	if (!orderData) {
		return false;
	}

	// Update payment status
	const {data, error} = await supabase
		.from("orders")
		.update({payment_status: 2, payment_ID: paymentId!})
		.eq("id", orderData.id!)
		.select();
	if (error) {
		console.error(
			"Erreur lors de la mise à jour du statut de paiement :",
			error
		);
		return false;
	}
	if (!data || data.length === 0) {
		console.warn("Aucune ligne mise à jour !");
		return false;
	}
	return true;
}*/
export async function updatePaymentOrderService(
	orderId: Order["id"],
	paymentId: Order["payment_ID"]
): Promise<Order | null> {
	// retourne la commande mise à jour
	console.log("orderId", orderId);
	console.log("paymentId", paymentId);

	const orderData = await getOrderService(orderId);
	if (!orderData) return null;

	const {data, error} = await supabase
		.from("orders")
		.update({payment_status: 2, payment_ID: paymentId!})
		.eq("id", orderData.id!)
		.select()
		.single();
	if (error) {
		console.error(
			"Erreur lors de la mise à jour du statut de paiement :",
			error
		);
		return null;
	}

	return data as Order;
}

export async function deleteOrderFromBdd(
	OrderID: Order["id"]
): Promise<boolean> {
	// Récupérer la commande
	const orderData = await getOrderService(OrderID);
	if (!orderData || !orderData.id) {
		console.error("Commande introuvable pour l'ID :", OrderID);
		return false;
	}

	console.log("Suppression de la commande ID :", orderData.id);
	console.log("Suppression cart_id :", orderData.cart_id);

	// Supprimer les produits liés au panier
	if (orderData.cart_id) {
		// Log avant suppression
		const {data: existingProducts} = await supabase
			.from("carts_products")
			.select("*")
			.eq("cart_id", orderData.cart_id);

		console.log(
			"Produits trouvés avant suppression :",
			existingProducts?.length
		);

		// Supprime sans select
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

		// Vérification après suppression
		const {data: afterDelete} = await supabase
			.from("carts_products")
			.select("*")
			.eq("cart_id", orderData.cart_id);

		console.log(
			"Produits restants après suppression :",
			afterDelete?.length
		);
	} else {
		console.warn("Pas de cart_id associé, aucun produit à supprimer");
	}

	// Supprimer la commande
	const {data: deletedOrder, error: errorOrder} = await supabase
		.from("orders")
		.delete()
		.eq("id", orderData.id)
		.select(); // récupère la commande supprimée

	if (errorOrder) {
		console.error("Erreur de suppression de la commande :", errorOrder);
		return false;
	}

	console.log("Commande supprimée :", deletedOrder);

	return true;
}
/*
export async function updateOrderFromBdd(
	paymentIntentId: string
): Promise<boolean> {
	// Supprimer la commande
	const {data: deletedOrder, error: errorOrder} = await supabase
		.from("orders")
		.update()
		.eq("payment_ID", paymentIntentId)
		.select(); // récupère la commande supprimée

	if (errorOrder) {
		console.error("Erreur de suppression de la commande :", errorOrder);
		return false;
	}

	console.log("Commande updated :", deletedOrder);

	return true;
}*/

export async function getCarrierDetails(carrierId: string) {
	const carriers = await fetchShippingOptions();
	for (const deliveryMode of carriers.delivery_modes) {
		const found = deliveryMode.transporters.find(
			(carrier) => carrier.id === carrierId
		);
		if (found) return {deliveryMode, transporter: found};
	}

	throw new Error(`Transporteur inconnu : ${carrierId}`);
}

export async function getOrderService(
	orderId?: Order["id"]
): Promise<Order | null> {
	// Get last order with id if given
	if (orderId) {
		const {data, error} = await supabase
			.from("orders")
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
				carts (
				id,
				carts_products (
					id,
					cart_id,
					product_id,
					title,
					price,
					quantity,
					image,
					category,
					description
				)
				)
			`
			)
			.eq("id", orderId)
			.limit(1)
			.maybeSingle();
		if (error) throw error;
		return data;
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
				carts (
				id,
				carts_products (
					id,
					cart_id,
					product_id,
					title,
					price,
					quantity,
					image,
					category,
					description
				)
				)
			`
		)
		.eq("user_id", userId)
		.eq("payment_status", 1)
		.order("created_at", {ascending: false})
		.limit(1)
		.maybeSingle();

	if (error) throw error;
	return data;
}
