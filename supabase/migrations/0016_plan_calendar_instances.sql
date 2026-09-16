-- Calendario → editar un plan asignado nunca debe mutar el plan compartido
-- (plantilla) ni todos los demás días a los que esté asignado el mismo
-- plan_id (asignación directa, "Programar en calendario" y repetición
-- indefinida siempre comparten el mismo plan_id). is_calendar_instance marca
-- una copia privada, creada bajo demanda ("fork on edit") la primera vez que
-- se pulsa "Editar" desde un día concreto del calendario — sus ediciones
-- sólo afectan a ese día. Se ocultan de Despensa → Planes (listPlans) y de
-- cualquier selector de planes hasta que el usuario las "promociona"
-- (Guardar como nuevo plan: se les desmarca esta columna y se les da un
-- nombre nuevo — no se crea ninguna fila nueva).
alter table public.plans
  add column is_calendar_instance boolean not null default false;
