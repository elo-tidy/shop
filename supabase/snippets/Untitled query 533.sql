create or replace function get_products_categories()
returns json
language sql
stable
as $$
  select json_agg(distinct category)
  from products
  where category is not null;
$$;