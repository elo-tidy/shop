SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict 9NQxtmFO0Z091s4hWzQYqMYNTeu4ePpKu70Iktw95yCZoUGaAnMsXVyrLU4mEkz

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
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."products" ("id", "title", "price", "description", "image", "archived", "category") VALUES
	(98, 'John Hardy Women''s Legends Naga Gold & Silver Dragon Station Chain Bracelet', 695, 'From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean''s pearl.', 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png', true, 'jewelery'),
	(99, 'Solid Gold Petite Micropave', 168, 'Satisfaction guaranteed.', 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png', false, 'jewelery'),
	(101, 'Pierced Owl Rose Gold Plated Stainless Steel Double', 10.99, 'Rose Gold Plated earrings.', 'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_t.png', false, 'jewelery'),
	(104, 'Silicon Power 256GB SSD 3D NAND A55 SATA III 2.5', 109, 'High performance SSD.', 'https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_t.png', false, 'electronics'),
	(105, 'WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive', 114, 'Gaming external drive.', 'https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png', false, 'electronics'),
	(109, 'Lock and Love Women''s Removable Hooded Faux Leather Moto Biker Jacket', 29.95, 'Faux leather jacket.', 'https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png', false, 'womens clothing'),
	(110, 'Rain Jacket Women Windbreaker Striped Climbing Raincoats', 39.99, 'Rain protection jacket.', 'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png', false, 'womens clothing'),
	(111, 'MBJ Women''s Solid Short Sleeve Boat Neck V', 9.85, 'Lightweight shirt.', 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png', false, 'womens clothing'),
	(108, 'BIYLACLESEN Women''s 3-in-1 Snowboard Jacket Winter Coats', 56.99, 'Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece. Detachable Functional Liner: Skin Friendly, Lightweigt and Warm.Stand Collar Liner jacket, keep you warm in cold weather. Zippered Pockets: 2 Zippered Hand Pockets, 2 Zippered Pockets on Chest (enough to keep cards or keys)and 1 Hidden Pocket Inside.Zippered Hand Pockets and Hidden Pocket keep your things secure. Humanized Design: Adjustable and Detachable Hood and Adjustable cuff to prevent the wind and water,for a comfortable fit. 3 in 1 Detachable Design provide more convenience, you can separate the coat and inner as needed, or wear it together. It is suitable for different season and help you adapt to different climates', 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png', false, 'womens clothing'),
	(100, 'White Gold Plated Princess', 9.99, 'Classic engagement ring.', 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_t.png', true, 'jewelery'),
	(103, 'SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s', 109, 'Fast SSD upgrade.', 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png', false, 'electronics'),
	(96, 'Mens Cotton Jacket', 55.99, 'Great outerwear jackets for Spring/Autumn/Winter.', 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png', false, 'mens clothing'),
	(94, 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops', 20, 'Your perfect pack for everyday use and walks in the forest.', 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png', false, 'mens clothing'),
	(102, 'WD 2TB Elements Portable External Hard Drive - USB 3.0', 64, 'Fast data transfer external drive.', 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png', false, 'electronics'),
	(113, 'DANVOUY Womens T Shirt Casual Cotton Short', 12.99, '95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.', 'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png', false, 'womens clothing'),
	(97, 'Mens Casual Slim Fit', 15.99, 'Slim fit casual style.', 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png', true, 'mens clothing'),
	(95, 'Mens Casual Premium Slim Fit T-Shirts', 22.5, 'Slim-fitting style, contrast raglan sleeves.', 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png', false, 'mens clothing');


--
-- Data for Name: carts_products; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: product_stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."product_stock" ("id", "product_id", "quantity", "updated_at") VALUES
	(1, 98, 10, '2026-05-29 10:32:19.525003'),
	(8, 99, 1, '2026-05-29 10:32:19.525003'),
	(13, 104, 10, '2026-05-29 10:32:19.525003'),
	(14, 105, 5, '2026-05-29 10:32:19.525003'),
	(9, 100, 1, '2026-05-29 11:39:06.009192'),
	(12, 103, 1, '2026-05-29 11:40:12.064231'),
	(18, 111, 0, '2026-07-09 15:12:30.350866'),
	(17, 110, 7, '2026-07-09 15:12:30.350866'),
	(2, 94, 97, '2026-07-10 13:26:24.507265'),
	(16, 109, 6, '2026-07-09 09:54:21.951632'),
	(15, 108, 20, '2026-06-18 11:53:23.699429'),
	(3, 95, 0, '2026-07-09 10:26:57.6716'),
	(11, 102, 1, '2026-07-09 10:49:43.386647'),
	(4, 96, 4, '2026-07-09 14:06:23.868973'),
	(20, 113, 476, '2026-07-02 10:04:38.321804'),
	(10, 101, 4, '2026-07-02 14:58:33.800289'),
	(5, 97, 8, '2026-07-03 09:49:52.639663');


--
-- Name: product_stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."product_stock_id_seq"', 60, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."products_id_seq"', 42, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict 9NQxtmFO0Z091s4hWzQYqMYNTeu4ePpKu70Iktw95yCZoUGaAnMsXVyrLU4mEkz

RESET ALL;
