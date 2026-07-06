-- Malá úprava: nie všetky kategórie budov majú "značku" (napr. parkoviská, pokladne)
alter table budovy alter column znacka drop not null;
