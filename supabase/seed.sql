SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict Bv1R1R56Susc21AgcXcPPxIHH63mXDaqVLF3LNr45gk7gFeNoeYHyiUfxMrDNjg

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '4c0bbe00-bc97-4531-8103-c1fde69d2581', '{"action":"user_signedup","actor_id":"cb445227-cd32-4a68-943d-b3a375bfad8e","actor_username":"lombard.eloise@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-05-29 10:59:29.511112+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ecbde77b-09b7-4228-a923-a15b757ef878', '{"action":"login","actor_id":"cb445227-cd32-4a68-943d-b3a375bfad8e","actor_username":"lombard.eloise@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-29 10:59:29.522563+00', ''),
	('00000000-0000-0000-0000-000000000000', '89a5ff02-a282-4f12-87e4-80a423c1fd26', '{"action":"user_recovery_requested","actor_id":"cb445227-cd32-4a68-943d-b3a375bfad8e","actor_username":"lombard.eloise@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-05-29 10:59:29.565567+00', ''),
	('00000000-0000-0000-0000-000000000000', '3c110749-8b87-4107-a3f5-8e0e74aa2367', '{"action":"login","actor_id":"cb445227-cd32-4a68-943d-b3a375bfad8e","actor_username":"lombard.eloise@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-29 10:59:35.519908+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b702c50c-3f99-40a7-b231-2545c534e5fb', '{"action":"token_refreshed","actor_id":"cb445227-cd32-4a68-943d-b3a375bfad8e","actor_username":"lombard.eloise@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-29 12:06:42.703879+00', ''),
	('00000000-0000-0000-0000-000000000000', 'db1cb7b7-6f9c-4439-9d3f-b8eaa429fe04', '{"action":"token_revoked","actor_id":"cb445227-cd32-4a68-943d-b3a375bfad8e","actor_username":"lombard.eloise@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-29 12:06:42.705209+00', ''),
	('00000000-0000-0000-0000-000000000000', '5e73ce01-07b3-487f-afa8-81c3446ab198', '{"action":"token_refreshed","actor_id":"cb445227-cd32-4a68-943d-b3a375bfad8e","actor_username":"lombard.eloise@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-29 13:05:35.823596+00', ''),
	('00000000-0000-0000-0000-000000000000', '8f136eef-9b78-4624-bf6a-1f6d59e0104d', '{"action":"token_revoked","actor_id":"cb445227-cd32-4a68-943d-b3a375bfad8e","actor_username":"lombard.eloise@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-29 13:05:35.825112+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'cb445227-cd32-4a68-943d-b3a375bfad8e', 'authenticated', 'authenticated', 'lombard.eloise@gmail.com', '$2a$10$6cp/kGHG3CX9.7bf/d3W3e6JblunF7GaVihoVusXOnO18Y1NXcPua', '2026-05-29 10:59:29.512687+00', NULL, '', NULL, '', '2026-05-29 10:59:29.569019+00', '', '', NULL, '2026-05-29 10:59:35.522754+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "cb445227-cd32-4a68-943d-b3a375bfad8e", "email": "lombard.eloise@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2026-05-29 10:59:29.499387+00', '2026-05-29 13:05:35.828484+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('cb445227-cd32-4a68-943d-b3a375bfad8e', 'cb445227-cd32-4a68-943d-b3a375bfad8e', '{"sub": "cb445227-cd32-4a68-943d-b3a375bfad8e", "email": "lombard.eloise@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-29 10:59:29.508643+00', '2026-05-29 10:59:29.508672+00', '2026-05-29 10:59:29.508672+00', '35779a60-5b58-42a9-a23c-11c3d9c450e3');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('af36ce3e-d062-4a10-9481-2a60ebd568f7', 'cb445227-cd32-4a68-943d-b3a375bfad8e', '2026-05-29 10:59:29.524504+00', '2026-05-29 10:59:29.524504+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '172.19.0.1', NULL, NULL, NULL, NULL, NULL),
	('85dc4445-6b30-43ea-86d6-16725ff79cce', 'cb445227-cd32-4a68-943d-b3a375bfad8e', '2026-05-29 10:59:35.52285+00', '2026-05-29 13:05:35.832285+00', NULL, 'aal1', NULL, '2026-05-29 13:05:35.832214', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '172.19.0.1', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('af36ce3e-d062-4a10-9481-2a60ebd568f7', '2026-05-29 10:59:29.529391+00', '2026-05-29 10:59:29.529391+00', 'password', 'aeca7472-e188-4132-a661-010084ea59ea'),
	('85dc4445-6b30-43ea-86d6-16725ff79cce', '2026-05-29 10:59:35.52619+00', '2026-05-29 10:59:35.52619+00', 'otp', 'aac2f7cd-7eb9-4f07-8f8d-975fcb5f5f84');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, 'x2y7fnv4zg3p', 'cb445227-cd32-4a68-943d-b3a375bfad8e', false, '2026-05-29 10:59:29.526871+00', '2026-05-29 10:59:29.526871+00', NULL, 'af36ce3e-d062-4a10-9481-2a60ebd568f7'),
	('00000000-0000-0000-0000-000000000000', 2, 'jwxnyb2gdl3i', 'cb445227-cd32-4a68-943d-b3a375bfad8e', true, '2026-05-29 10:59:35.524086+00', '2026-05-29 12:06:42.705788+00', NULL, '85dc4445-6b30-43ea-86d6-16725ff79cce'),
	('00000000-0000-0000-0000-000000000000', 3, '5wk2jzn3qira', 'cb445227-cd32-4a68-943d-b3a375bfad8e', true, '2026-05-29 12:06:42.707975+00', '2026-05-29 13:05:35.825698+00', 'jwxnyb2gdl3i', '85dc4445-6b30-43ea-86d6-16725ff79cce'),
	('00000000-0000-0000-0000-000000000000', 4, 'dhpruobpd3bw', 'cb445227-cd32-4a68-943d-b3a375bfad8e', false, '2026-05-29 13:05:35.827543+00', '2026-05-29 13:05:35.827543+00', '5wk2jzn3qira', '85dc4445-6b30-43ea-86d6-16725ff79cce');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "updated_at", "username", "role", "created_at") VALUES
	('cb445227-cd32-4a68-943d-b3a375bfad8e', NULL, NULL, 'admin', '2026-05-29 10:59:29.49874+00');


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."carts" ("id", "user_id", "created_at", "updated_at") VALUES
	('a2e04268-3da3-4730-bd1c-a0e5925dae23', 'cb445227-cd32-4a68-943d-b3a375bfad8e', '2026-05-29 13:06:01.160782+00', NULL),
	('50d8d0bf-777a-45d6-862a-73afc78d8815', 'cb445227-cd32-4a68-943d-b3a375bfad8e', '2026-05-29 13:06:32.596508+00', NULL);


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."products" ("id", "title", "price", "description", "image", "archived", "category") VALUES
	(98, 'John Hardy Women''s Legends Naga Gold & Silver Dragon Station Chain Bracelet', 695, 'From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean''s pearl.', 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png', true, 'jewelery'),
	(94, 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops', 109.95, 'Your perfect pack for everyday use and walks in the forest.', 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png', false, 'mens clothing'),
	(95, 'Mens Casual Premium Slim Fit T-Shirts', 22.3, 'Slim-fitting style, contrast raglan sleeves.', 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png', false, 'mens clothing'),
	(96, 'Mens Cotton Jacket', 55.99, 'Great outerwear jackets for Spring/Autumn/Winter.', 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png', false, 'mens clothing'),
	(97, 'Mens Casual Slim Fit', 15.99, 'Slim fit casual style.', 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png', false, 'mens clothing'),
	(114, 'Je teste l''interface admin', 10.8, 'ma description', 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png', false, 'mens clothing'),
	(99, 'Solid Gold Petite Micropave', 168, 'Satisfaction guaranteed.', 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png', false, 'jewelery'),
	(101, 'Pierced Owl Rose Gold Plated Stainless Steel Double', 10.99, 'Rose Gold Plated earrings.', 'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_t.png', false, 'jewelery'),
	(102, 'WD 2TB Elements Portable External Hard Drive - USB 3.0', 64, 'Fast data transfer external drive.', 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png', false, 'electronics'),
	(104, 'Silicon Power 256GB SSD 3D NAND A55 SATA III 2.5', 109, 'High performance SSD.', 'https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_t.png', false, 'electronics'),
	(105, 'WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive', 114, 'Gaming external drive.', 'https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png', false, 'electronics'),
	(109, 'Lock and Love Women''s Removable Hooded Faux Leather Moto Biker Jacket', 29.95, 'Faux leather jacket.', 'https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png', false, 'womens clothing'),
	(110, 'Rain Jacket Women Windbreaker Striped Climbing Raincoats', 39.99, 'Rain protection jacket.', 'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png', false, 'womens clothing'),
	(111, 'MBJ Women''s Solid Short Sleeve Boat Neck V', 9.85, 'Lightweight shirt.', 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png', false, 'womens clothing'),
	(108, 'BIYLACLESEN Women''s 3-in-1 Snowboard Jacket Winter Coats', 56.99, 'Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece. Detachable Functional Liner: Skin Friendly, Lightweigt and Warm.Stand Collar Liner jacket, keep you warm in cold weather. Zippered Pockets: 2 Zippered Hand Pockets, 2 Zippered Pockets on Chest (enough to keep cards or keys)and 1 Hidden Pocket Inside.Zippered Hand Pockets and Hidden Pocket keep your things secure. Humanized Design: Adjustable and Detachable Hood and Adjustable cuff to prevent the wind and water,for a comfortable fit. 3 in 1 Detachable Design provide more convenience, you can separate the coat and inner as needed, or wear it together. It is suitable for different season and help you adapt to different climates', 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png', false, 'womens clothing'),
	(113, 'DANVOUY Womens T Shirt Casual Cotton Short', 12.99, '95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.', 'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png', true, 'womens clothing'),
	(100, 'White Gold Plated Princess', 9.99, 'Classic engagement ring.', 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_t.png', true, 'jewelery'),
	(103, 'SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s', 109, 'Fast SSD upgrade.', 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png', false, 'electronics');


--
-- Data for Name: carts_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."carts_products" ("id", "cart_id", "product_id", "quantity", "price", "created_at", "title", "image", "category", "description") VALUES
	('3e4d9bbf-7149-4c75-b575-aaa73debe7fd', 'a2e04268-3da3-4730-bd1c-a0e5925dae23', 111, 1, 9.85, '2026-05-29 13:06:01.173042', 'MBJ Women''s Solid Short Sleeve Boat Neck V', 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png', 'womens clothing', 'Lightweight shirt.'),
	('9b0c9a79-ee38-4699-84d7-31c6792fc144', '50d8d0bf-777a-45d6-862a-73afc78d8815', 95, 1, 22.3, '2026-05-29 13:06:32.604784', 'Mens Casual Premium Slim Fit T-Shirts', 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png', 'mens clothing', 'Slim-fitting style, contrast raglan sleeves.');


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."orders" ("id", "cart_id", "user_id", "payment_ID", "payment_method", "payment_status", "stripe_event_id", "created_at", "updated_at", "delivery_carrier", "delivery_date", "delivery_price", "delivery_status", "products_price", "total_price") VALUES
	('b8136620-51a2-4131-9c0f-54fe572d48b3', 'a2e04268-3da3-4730-bd1c-a0e5925dae23', 'cb445227-cd32-4a68-943d-b3a375bfad8e', 'pi_3TcQ6uASKJ7DoQcy0yCxIx0x', 'Carte bancaire', 'paid', 'evt_3TcQ6uASKJ7DoQcy0gHZtb4j', '2026-05-29 13:06:01.184964', '2026-05-29 13:06:07.499417', 'ups', '2026-06-05 00:00:00+00', 10.5, 'processing', 9.85, 20.35),
	('34f5561b-6057-4a3a-b717-34d51c4f9673', '50d8d0bf-777a-45d6-862a-73afc78d8815', 'cb445227-cd32-4a68-943d-b3a375bfad8e', 'pi_3TcQ7QASKJ7DoQcy0lQE5zE4', 'Carte bancaire', 'failed', 'evt_3TcQ7QASKJ7DoQcy0xgbbjO2', '2026-05-29 13:06:32.614645', '2026-05-29 13:06:32.614645', 'dhl', '2026-06-04 00:00:00+00', 15, 'processing', 22.3, 37.3);


--
-- Data for Name: product_stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."product_stock" ("id", "product_id", "quantity", "updated_at") VALUES
	(1, 98, 10, '2026-05-29 10:32:19.525003'),
	(2, 94, 11, '2026-05-29 10:32:19.525003'),
	(4, 96, 5, '2026-05-29 10:32:19.525003'),
	(5, 97, 10, '2026-05-29 10:32:19.525003'),
	(8, 99, 1, '2026-05-29 10:32:19.525003'),
	(10, 101, 10, '2026-05-29 10:32:19.525003'),
	(11, 102, 0, '2026-05-29 10:32:19.525003'),
	(13, 104, 10, '2026-05-29 10:32:19.525003'),
	(14, 105, 5, '2026-05-29 10:32:19.525003'),
	(16, 109, 10, '2026-05-29 10:32:19.525003'),
	(17, 110, 10, '2026-05-29 10:32:19.525003'),
	(15, 108, 21, '2026-05-29 11:09:48.689253'),
	(20, 113, 11, '2026-05-29 11:10:35.2492'),
	(9, 100, 1, '2026-05-29 11:39:06.009192'),
	(12, 103, 1, '2026-05-29 11:40:12.064231'),
	(6, 114, 21, '2026-05-29 12:23:16.957876'),
	(3, 95, 9, '2026-05-29 12:28:38.791225'),
	(18, 111, 8, '2026-05-29 13:06:07.499417');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 4, true);


--
-- Name: product_stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."product_stock_id_seq"', 22, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."products_id_seq"', 2, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict Bv1R1R56Susc21AgcXcPPxIHH63mXDaqVLF3LNr45gk7gFeNoeYHyiUfxMrDNjg

RESET ALL;
