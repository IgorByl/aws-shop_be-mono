--CREATE TABLE products (
--	id uuid PRIMARY KEY default uuid_generate_v4(),
--	title text not null,
--	description text,
--    price integer,
--    unique (id)
--)

--create extension if not exists "uuid-ossp";  

--drop table products;
--drop table stocks;

--CREATE TABLE stocks (
--	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--	product_id uuid,
--	count integer,
--	unique (id),
--	foreign key ("product_id") references "products" ("id")
--	on delete cascade
--	on update cascade
--)

--insert into products (title, description, price) 
--values ('ProductNew', 'Short Product Description3', 10),
-- ('ProductTop', 'Short Product Description2', 23),
-- ('ProductTitle', 'Short Product Description1', 11),
-- ('Product', 'Short Product Description5', 12),
-- ('ProductTest', 'Short Product Description8', 17),
-- ('Product2', 'Short Product Description9', 18),
-- ('ProductName', 'Short Product Description0', 14)

--insert into stocks (count, product_id) 
--values (2, '231abfdf-c232-46ac-b17e-483fe090ab6c'),
--(2, '9600f068-58ab-4890-928f-7c2f1fe9c66c'),
--(2, 'd7cece7a-fe96-434b-8dbf-e9658cb1d28a'),
--(2, 'faf2e351-0976-43b3-a42a-26d9e3f8b056'),
--(2, 'e9ed8303-3813-4d8f-83c6-276901dc8a7c'),
--(2, 'c1c15648-5df5-46b6-975d-c3cfacd1454f'),
--(2, '9e94bad2-0d4f-4b70-bb38-7b1bdccc991e')
