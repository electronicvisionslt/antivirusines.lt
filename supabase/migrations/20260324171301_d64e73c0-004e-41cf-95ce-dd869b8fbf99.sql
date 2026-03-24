INSERT INTO article_products (article_id, product_id, sort_order) VALUES
('c45dc347-0f58-477f-8651-6313fdb6a0fb', 'e1c1d9e7-d717-45bc-a152-a1771f83ff48', 0),
('8a2a5e6b-8c88-48f8-bb4b-6d9f37c19d64', '1f070907-8d01-45f8-880a-525c4915b05c', 0),
('02e1dc11-af0f-4b0b-ab50-470b93aabfb8', '78237c8f-8f7b-419c-8082-577451070ed6', 0),
('80f60ff8-8688-48c6-9843-9e91659090d6', '6d3f293c-452c-4393-be2f-5ba9d395201c', 0)
ON CONFLICT DO NOTHING;