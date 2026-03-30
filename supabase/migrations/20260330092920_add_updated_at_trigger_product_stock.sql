drop trigger if exists set_updated_at_product_stock on product_stock;

-- update function
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- trigger update function on product_stock table
create trigger set_updated_at_product_stock
before update on product_stock
for each row
execute function update_updated_at_column();