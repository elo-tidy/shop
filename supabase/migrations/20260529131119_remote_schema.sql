


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."categories" AS ENUM (
    'electronics',
    'jewelery',
    'mens clothing',
    'womens clothing'
);


ALTER TYPE "public"."categories" OWNER TO "postgres";


CREATE TYPE "public"."delivery_status" AS ENUM (
    'processing',
    'shipped',
    'in_delivery',
    'delivered',
    'returned'
);


ALTER TYPE "public"."delivery_status" OWNER TO "postgres";


CREATE TYPE "public"."payment_status" AS ENUM (
    'pending',
    'paid',
    'failed',
    'refunded'
);


ALTER TYPE "public"."payment_status" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'user',
    'admin'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_products_categories"() RETURNS json
    LANGUAGE "sql" STABLE
    AS $$
  select json_agg(distinct category)
  from products
  where category is not null;
$$;


ALTER FUNCTION "public"."get_products_categories"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into profiles (
    id,
    username,
    role,
    created_at
  )
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    'user',
    now()
  );

  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."process_paid_order"("p_order_id" "uuid", "p_payment_intent_id" "text", "p_stripe_event_id" "text") RETURNS json
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
declare
  order_row orders%rowtype;
  expected_products_count integer;
  updated_stock_count integer;
begin

  -- lock order
  select *
  into order_row
  from orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'Order not found';
  end if;

  -- idempotence: already paid
  if order_row.payment_status = 'paid' then
    return json_build_object(
      'success', true,
      'noop', true,
      'message', 'Order already paid'
    );
  end if;

  -- idempotence stripe event
  if order_row.stripe_event_id = p_stripe_event_id then
    return json_build_object(
      'success', true,
      'noop', true,
      'message', 'Stripe event already processed'
    );
  end if;

  -- security check
  if order_row."payment_ID" != p_payment_intent_id then
    raise exception 'Payment intent mismatch';
  end if;

  -- expected products
  select count(*)
  into expected_products_count
  from (
    select distinct cp.product_id
    from carts_products cp
    where cp.cart_id = order_row.cart_id
  ) p;

  -- stock update
  update product_stock ps
  set
    quantity = ps.quantity - x.total_quantity,
    updated_at = now()
  from (
    select
      cp.product_id,
      sum(cp.quantity)::int as total_quantity
    from carts_products cp
    where cp.cart_id = order_row.cart_id
    group by cp.product_id
  ) x
  where ps.product_id = x.product_id
    and ps.quantity >= x.total_quantity;

  GET DIAGNOSTICS updated_stock_count = ROW_COUNT;

  -- safety stock
  if updated_stock_count != expected_products_count then
    raise exception 'Insufficient stock';
  end if;

  -- final update order
  update orders
  set
    payment_status = 'paid',
    stripe_event_id = p_stripe_event_id,
    updated_at = now()
  where id = p_order_id;

  return json_build_object(
    'success', true,
    'processed', true
  );

end;
$$;


ALTER FUNCTION "public"."process_paid_order"("p_order_id" "uuid", "p_payment_intent_id" "text", "p_stripe_event_id" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."carts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."carts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."carts_products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "cart_id" "uuid" NOT NULL,
    "product_id" integer NOT NULL,
    "quantity" integer NOT NULL,
    "price" numeric NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "title" character varying,
    "image" character varying,
    "category" "public"."categories",
    "description" "text"
);


ALTER TABLE "public"."carts_products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "cart_id" "uuid",
    "user_id" "uuid" NOT NULL,
    "payment_ID" "text",
    "payment_method" "text" NOT NULL,
    "payment_status" "public"."payment_status" DEFAULT 'pending'::"public"."payment_status" NOT NULL,
    "stripe_event_id" "text",
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "delivery_carrier" character varying NOT NULL,
    "delivery_date" timestamp with time zone NOT NULL,
    "delivery_price" numeric NOT NULL,
    "delivery_status" "public"."delivery_status" DEFAULT 'processing'::"public"."delivery_status" NOT NULL,
    "products_price" numeric NOT NULL,
    "total_price" numeric NOT NULL
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_stock" (
    "id" integer NOT NULL,
    "product_id" integer,
    "quantity" integer DEFAULT 0,
    "updated_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."product_stock" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."product_stock_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."product_stock_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."product_stock_id_seq" OWNED BY "public"."product_stock"."id";



CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" integer NOT NULL,
    "title" "text" NOT NULL,
    "price" numeric NOT NULL,
    "description" "text",
    "image" "text",
    "archived" boolean DEFAULT false,
    "category" "public"."categories" NOT NULL
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."products_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."products_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."products_id_seq" OWNED BY "public"."products"."id";



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "username" "text",
    "role" "public"."user_role" DEFAULT 'user'::"public"."user_role" NOT NULL,
    "created_at" timestamp with time zone,
    CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."product_stock" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."product_stock_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."products" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."products_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."carts_products"
    ADD CONSTRAINT "carts_products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_stock"
    ADD CONSTRAINT "product_stock_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_stock"
    ADD CONSTRAINT "product_stock_product_id_key" UNIQUE ("product_id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



CREATE INDEX "idx_orders_payment_id" ON "public"."orders" USING "btree" ("payment_ID");



CREATE INDEX "idx_orders_stripe_event" ON "public"."orders" USING "btree" ("stripe_event_id");



CREATE OR REPLACE TRIGGER "set_updated_at_product_stock" BEFORE UPDATE ON "public"."product_stock" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."carts_products"
    ADD CONSTRAINT "carts_products_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."carts_products"
    ADD CONSTRAINT "carts_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."product_stock"
    ADD CONSTRAINT "product_stock_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Enable insert for admin based on user_id" ON "public"."products" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"public"."user_role")))));



CREATE POLICY "Enable read access for all users" ON "public"."product_stock" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."products" FOR SELECT USING (true);



CREATE POLICY "Enable select for users based on user_id" ON "public"."orders" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable users to update their own data only" ON "public"."profiles" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Enable users to view their own data only" ON "public"."carts" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable users to view their own data only" ON "public"."profiles" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Select own cart_products" ON "public"."carts_products" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."carts"
  WHERE (("carts"."id" = "carts_products"."cart_id") AND ("carts"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



ALTER TABLE "public"."carts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."carts_products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_stock" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";































































































































































GRANT ALL ON FUNCTION "public"."get_products_categories"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_products_categories"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_products_categories"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."process_paid_order"("p_order_id" "uuid", "p_payment_intent_id" "text", "p_stripe_event_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."process_paid_order"("p_order_id" "uuid", "p_payment_intent_id" "text", "p_stripe_event_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."process_paid_order"("p_order_id" "uuid", "p_payment_intent_id" "text", "p_stripe_event_id" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."carts" TO "anon";
GRANT ALL ON TABLE "public"."carts" TO "authenticated";
GRANT ALL ON TABLE "public"."carts" TO "service_role";



GRANT ALL ON TABLE "public"."carts_products" TO "anon";
GRANT ALL ON TABLE "public"."carts_products" TO "authenticated";
GRANT ALL ON TABLE "public"."carts_products" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."product_stock" TO "anon";
GRANT ALL ON TABLE "public"."product_stock" TO "authenticated";
GRANT ALL ON TABLE "public"."product_stock" TO "service_role";



GRANT ALL ON SEQUENCE "public"."product_stock_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."product_stock_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."product_stock_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON SEQUENCE "public"."products_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."products_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."products_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


