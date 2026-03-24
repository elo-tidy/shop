-- Création d'une fonction PostgreSQL qui renvoie un jsonb avec toutes les valeurs de l'enum categories
CREATE OR REPLACE FUNCTION public.get_products_categories()
RETURNS jsonb
LANGUAGE sql
AS $$
  SELECT jsonb_agg(value)
  FROM unnest(enum_range(NULL::categories)) AS value;
$$;