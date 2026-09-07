# Estado del proyecto Nutri

> Este archivo se actualiza al final de cada bloque de trabajo y se lee automáticamente
> al arrancar cualquier sesión de Claude Code en este repo (importado desde `CLAUDE.md`).
> Sirve para que una sesión nueva retome el trabajo sin perder contexto.

Última actualización: **2026-09-07**.

## Visión general de fases

| Fase | Estado |
|---|---|
| Fase 1 — Auth, onboarding, shell, sistema de diseño "Vibrante/Enérgico" | ✅ Completa y commiteada |
| Fase 2 — Despensa (Alimentos, Comidas, Planes) | ✅ Completa y commiteada |
| Fase 3 — Calendario, bloque 1 (asignar/quitar planes a días, marcar "Libre") | ✅ Completa y commiteada |
| Fase 3 — Calendario, bloque 2 (seguimiento de consumo + puntuación diaria) | ✅ Completa y commiteada |
| Fase 3 — Despensa → Planes: sustitución inteligente de alimentos | ✅ Completa y commiteada (ver nota de alcance abajo) |
| Fase 3 — Calendario, bloque 3 (programación/repetición de planes) | ✅ Completa y commiteada — **Fase 3 cerrada por completo** |
| Fase 4 — Entrenamiento, bloque 1 (catálogo de Ejercicios + Rutinas) | 🚧 En curso |
| Fase 4 — Entrenamiento, bloques futuros (integración con Calendario, seguimiento de sesiones) | ⏳ Sin empezar |

> **Nota de alcance:** el plan original agrupaba "sustitución inteligente" bajo Calendario, pero
> la funcionalidad opera sobre `plan_item_foods` (la instantánea editable de un plan), no sobre
> `calendar_days` — así que vive en `src/features/plans/`, no en `src/features/calendar/`. Se
> mantiene aquí bajo "Fase 3" solo para no romper el orden de encargo original.

Commits hasta ahora (los más recientes primero):
```
(pendiente) Phase 3 / slice 3: Calendario → plan scheduling/repetition
3eb77f0 Phase 3: Despensa → Planes — smart food substitution
2cb5194 Phase 3 / slice 2: Calendario → daily consumption tracking + score
6a61e41 Phase 3 / slice 1: Calendario (assign/remove plans per day, free days)
8f575a3 Add project status handoff + Calendario slice 1 prep work
e8fe14a Phase 2 / slice 3: Despensa → Planes
7ef6894 Phase 2 / slice 2: Despensa → Comidas
d0e99bb Phase 2 / slice 1: Despensa → Alimentos
ff58fc3 Apply "Vibrante/Enérgico" as the app's permanent design system
812732b Phase 1: auth, personalization onboarding, and app shell
```

## Qué hay ya construido (Fases 1-3, hasta sustitución inteligente)

Arquitectura de referencia — leer el código es más fiable que resumirlo aquí, pero como mapa rápido:

- `src/features/<feature>/` por cada dominio (`auth`, `profile`, `foods`, `meals`, `plans`, `calendar`, `pantry`, `home`, `settings`, `app-shell`), cada uno con `schema.ts` (zod + opciones/labels) si hace falta, `api/` (wrappers finos de Supabase, lanzan en error), `hooks/` (TanStack Query, una función por hook, claves `xQueryKey(...)`), `mappers.ts` si hace falta, `components/`, `index.ts` (barrel — las features solo se importan entre sí a través de él, nunca con rutas internas, **excepto** los módulos de cálculo puro tipo `contribution.ts`/`totals.ts`/`score.ts`/`substitution.ts`, que se importan por su ruta concreta *entre módulos de cálculo* para no arrastrar dependencias nativas a los tests de Jest — un componente de UI sí puede importarlos vía barrel normalmente, como hace `FoodSubstitutionPickerScreen` con `suggestSubstitutes` desde `@/features/foods`).
- `src/components/`: primitivas compartidas (`Screen`, `ThemedText`, `Button`, `TextField`, `NumericField`, `OptionPicker`, `LabeledSlider`, `FieldLabel`, `PlaceholderScreen`, `FullScreenSpinner`, `ConfirmDialog`, `CollapsibleSection`, `MacroDonutChart`, `TargetProgressBar`).
- `src/constants/theme.ts` + `src/hooks/use-theme.ts`: identidad visual "Vibrante/Enérgico" (negro casi puro estructural, coral `accent` para selección, lima `accentSecondary` para progreso, radios 10-14px, bordes sólidos 1.5px, tipografías Space Grotesk/Work Sans).
- `src/hooks/use-themed-stack-options.ts`: opciones de cabecera compartidas para cualquier `Stack`.
- `src/lib/dates.ts`: helpers de fecha sin librería externa (`toDateKey`/`fromDateKey`, `addDays`, `isSameDay`, `isToday`, `formatChipWeekday`, `formatDisplayDate` vía `Intl.DateTimeFormat('es-ES', ...)`).
- Patrón de rutas: cada sección de una tab que necesita varias pantallas se convierte en un directorio con su propio `_layout.tsx` (Stack), y la tab padre (`(tabs)/_layout.tsx`) pasa esa entrada a `headerShown:false` — ver `despensa/_layout.tsx` → `despensa/comidas/_layout.tsx` → `despensa/planes/_layout.tsx` y `calendario/_layout.tsx` como ejemplos ya construidos.
- Base de datos: `supabase/migrations/0001` a `0007` — `profiles`, `foods`, `meals`+`meal_items`, `plans`+`plan_items`+`plan_item_foods`, `calendar_days`, `plan_item_completions`. La sustitución de alimentos **no añadió migración**: la policy `plan_item_foods_update_own` (0005) ya permitía cambiar `food_id` siempre que el nuevo alimento sea del mismo usuario, así que reasignar `food_id`+`quantity` en una sustitución ya estaba cubierto por RLS. Convenciones generales: enums de Postgres (no text+check) para catálogos fijos; toda tabla propia de usuario tiene `user_id` + 4 políticas RLS (o resuelve propiedad vía `exists` contra su padre si no tiene `user_id` propio); una tabla hija exclusivamente propiedad de su padre usa FK `on delete cascade` (`meal_items.meal_id`, `plan_items.plan_id`, `plan_item_foods.plan_item_id`, `plan_item_completions.calendar_day_id`/`plan_item_id`); una FK a una entidad-catálogo *reutilizable* (`food_id`, `meal_id` como "ingrediente") usa RESTRICT (sin `on delete`) para que borrarla en uso lance `23503`, capturado por `src/lib/supabase/errors.ts` (`isForeignKeyViolation`/`friendlyDeleteErrorMessage`).
- `calendar_days` tiene una fila por `(user_id, date)` (constraint unique), mutuamente exclusiva entre `plan_id` asignado e `is_free` (check constraint); la ausencia de fila para una fecha significa "sin planificar". `plan_item_completions` sigue la misma filosofía: la **existencia** de la fila es el flag "comido" (insert-o-delete vía `useToggleMealCompletion`, sin columna booleana ni `update`).
- Lección aprendida (arrastre): **no usar librerías de arrastre basadas en gestos** (se probó `react-native-draggable-flatlist`; su medición interna usa `findNodeHandle`, no soportado en RNW). Se sustituyó por botones de subir/bajar.
- Lección aprendida (RNW + `FlatList` horizontal): un `FlatList`/`ScrollView` horizontal **sin `style` con altura explícita** se estira para ocupar todo el alto disponible del contenedor flex en React Native Web (bien en iOS/Android). Fix: `style` con `height` fija + `flexGrow: 0, flexShrink: 0`. Comprobar siempre visualmente en `expo start --web`, no solo con `tsc`.
- Verificación end-to-end de cada bloque: usuario de prueba creado por SQL directo (`auth.users`+`auth.identities`, confirmado sin email), Playwright contra `expo start --web`, borrado del usuario de prueba (y sus datos) al terminar. **Detalle importante:** insertar en `auth.users` a mano sin rellenar `email_change`, `email_change_token_new`, `email_change_token_current`, `phone_change`, `phone_change_token` y `reauthentication_token` (dejarlos en `NULL`) hace que el login por password devuelva `500` (el driver Go de GoTrue no puede escanear `NULL` en esas columnas `string`) — hay que ponerlas a `''` explícitamente; ya incorporado en la receta de creación de usuario de prueba usada en todos los bloques desde Calendario bloque 1. `tsc --noEmit`, `npx jest`, `npx expo lint` deben quedar limpios antes de dar un bloque por cerrado, y `get_advisors` (Supabase) debe devolver 0 avisos de seguridad nuevos tras cada migración que sí toque el esquema (el único aviso presente, `auth_leaked_password_protection`, es preexistente).
- Playwright no es una dependencia del proyecto (`node_modules`) pero está instalado globalmente vía nvm; para usarlo desde un script Node en este repo hace falta `NODE_PATH="$(npm root -g)" node script.js`.

## Qué hay construido en Calendario, bloque 1 (Fase 3)

- `src/features/calendar/`: `api/calendarDays.ts` (`getCalendarDay`, `listCalendarDaysInRange`, `upsertCalendarDay`, `deleteCalendarDay`), `hooks/` (`useCalendarDay`, `useCalendarDaysRange`, `useAssignPlanToDay`, `useMarkDayFree`, `useRemoveDayAssignment`), `components/` (`DayStrip`, `CalendarDayPanel`, `AssignedPlanSummary`, `CalendarScreen`, `PlanAssignmentPickerScreen` + `PlanPickerListItem`).
- Rutas: `calendario/_layout.tsx`, `calendario/index.tsx`, `calendario/asignar-plan.tsx`.
- Verificado end-to-end: asignar plan a un día, "Editar" navega a `despensa/planes/[id]`, "Quitar" con `ConfirmDialog`, "Marcar como libre"/"Quitar" sobre día libre, y borrar desde Despensa → Planes un plan asignado a un día muestra el aviso amigable "en uso" en vez de un error crudo.

## Qué hay construido en Calendario, bloque 2 (Fase 3) — seguimiento + puntuación

- `supabase/migrations/0007_plan_item_completions.sql`: tabla `plan_item_completions`.
- `src/features/calendar/calculations/score.ts` (+ test): `calculateDailyScore(totals, targets)` pondera calorías 40% y cada macro 20%, suelo en 0, `null` si falta cualquier target.
- `src/features/calendar/api/planItemCompletions.ts` + hooks `useCalendarDayCompletions`/`useToggleMealCompletion`.
- Componentes: `MealCompletionList`, `DailyScoreSummary` (reutiliza `PlanProgressSummary`/`TargetProgressBar` de `plans`, exportados desde `plans/index.ts` junto con `PlanTargets` y `PlanItemWithDetails`), `DailyTrackingSection`.
- Verificado end-to-end con datos sembrados por SQL: la puntuación calculada a mano coincidía exacto con la mostrada en pantalla (51/100) al marcar una comida.

## Qué hay construido en sustitución inteligente de alimentos (Fase 3, en Despensa → Planes)

- `src/features/foods/calculations/substitution.ts` (+ `substitution.test.ts`, módulo puro): `suggestSubstitutes(target, candidates)` — para cada alimento candidato calcula la cantidad que reproduce las mismas calorías que `target` (una `FoodContribution` ya calculada con `calculateFoodContribution`), y puntúa 0-100 la similitud de macros (proteína/carbohidratos/grasa a partes iguales) a esa cantidad igualadora. Así "pollo → pavo" puntúa por encima de "pollo → aceite de oliva" aunque ambos puedan dosificarse para dar las mismas calorías. Candidatos con calorías-por-ración ≤ 0 (p. ej. agua) se descartan porque no se pueden escalar a ningún objetivo positivo. Exportado desde `src/features/foods/index.ts` (`suggestSubstitutes`, tipo `SubstitutionSuggestion`) para que las pantallas lo consuman vía barrel normalmente.
- `src/features/plans/api/planItemFoods.ts`: nueva `substitutePlanItemFood(id, foodId, quantity)` — un `update` de `food_id`+`quantity` sobre la fila de `plan_item_foods`; **sin migración**, la policy `plan_item_foods_update_own` ya cubría el nuevo `food_id` (debe pertenecer al usuario). Hook `useSubstitutePlanItemFood`.
- `FoodSubstitutionPickerScreen` (en `plans`, ruta `despensa/planes/sustituir-alimento.tsx`, parámetros `planId`+`planItemFoodId`): localiza el `plan_item_food` actual vía `usePlanItems(planId)`, calcula su `FoodContribution` como objetivo, y lista `useFoods(userId)` (menos el alimento actual) ordenados por similitud, con buscador y filtro de categoría igual que `FoodPickerScreen`/`MealPickerScreen`. Cada fila (`FoodSubstitutionListItem`) muestra alimento, cantidad sugerida, kcal resultante y % de similitud. Al elegir uno, sustituye y vuelve atrás.
- Disparador: icono "swap-horizontal-outline" añadido a cada fila de alimento en `PlanMealGroup.tsx` (`PlanItemFoodRow`), junto al icono de eliminar comida ya existente.
- Verificado end-to-end con datos sembrados por SQL (pollo 200kcal/100g como objetivo a 150g, pavo 150kcal/100g y aceite de oliva 884kcal/100g como candidatos): el pavo salió primero (73% similitud) y el aceite segundo (48%), y sustituir por pavo dejó el plan con "Pavo E2E · 200 g" y los totales de proteína/grasa del plan recalculados correctamente.

## Qué hay construido en programación/repetición de planes (Fase 3, cierra Calendario)

- `src/features/calendar/calculations/schedule.ts` (+ test, módulo puro): `generateScheduleDates(startDate, days, weekdays)` — cada fecha en la ventana `[startDate, startDate+days-1]` cuyo `Date#getDay()` esté en el set `weekdays`. No hay tabla de "reglas recurrentes": la programación **materializa filas `calendar_days` inmediatamente** (bulk upsert) en vez de guardar una regla abstracta a interpretar después — más simple y consistente con que `calendar_days` sea la única fuente de verdad del calendario.
- `src/features/calendar/api/calendarDays.ts`: nueva `upsertCalendarDays(rows[])` (versión en bloque de `upsertCalendarDay`, mismo `onConflict: 'user_id,date'`). Hook `useApplyPlanSchedule`.
- `PlanScheduleScreen` (en `calendar`, ruta `despensa/planes/programar-calendario.tsx`, parámetro `planId` — mismo patrón cruzado que `calendario/asignar-plan.tsx` usando una pantalla de `plans`, pero al revés): siempre empieza hoy, con un `NumericField` "repetir durante (días)" y 7 chips de día de la semana (L M X J V S D, todos seleccionados por defecto). Antes de aplicar, calcula conflictos contra `useCalendarDaysRange` (días que ya tienen plan o están libres) y si hay alguno, pide confirmación con `ConfirmDialog` antes de sobrescribir; si no hay conflicto, aplica directo.
- Disparador: botón "Programar en calendario" en `PlanDetailScreen`, justo debajo de `PlanProgressSummary`.
- Verificado end-to-end con datos sembrados por SQL (un día ya marcado libre dentro de la ventana): el diálogo de conflicto apareció con el recuento correcto (1), y tras confirmar, ese día pasó de "Día libre" a mostrar el plan programado.

## Alcance pendiente para la siguiente sesión: Fase 4, Entrenamiento

Decisión tomada con el usuario (2026-09-07): el primer bloque de Entrenamiento es un **catálogo de Ejercicios + Rutinas**, en espejo del patrón ya usado en Despensa (Alimentos → Comidas → Planes), **sin tocar todavía el Calendario** (eso queda para un bloque futuro de integración). Construir siguiendo exactamente las convenciones ya establecidas:
- `src/features/exercises/` (o el nombre que se decida): CRUD de ejercicios (nombre, grupo muscular, quizá equipo/tipo) — mismo patrón que `foods` (schema.ts con enum de categoría, api/, hooks/, componentes de lista/crear/editar).
- `src/features/routines/` (o similar): una rutina agrupa ejercicios con series/repeticiones/peso (posiblemente con una tabla de snapshot tipo `plan_item_foods` si algún día se quiere "instanciar" una rutina en un día concreto) — mismo patrón que `meals`/`plans`.
- Rutas bajo `entrenamiento/` con su propio `_layout.tsx`, reemplazando el placeholder actual `src/app/(app)/(tabs)/entrenamiento.tsx`, igual que se hizo con `calendario.tsx` → `calendario/`.
- Diseñar el esquema de Postgres (nueva(s) migraciones) siguiendo las convenciones ya fijadas arriba (RLS, cascade vs RESTRICT según si la fila es "propiedad exclusiva" o "referencia a catálogo reutilizable").
- Verificar con el mismo ciclo: `tsc`/`jest`/`expo lint` limpios, `get_advisors` en 0 avisos nuevos, y Playwright end-to-end con usuario de prueba creado por SQL (usando ya la receta correcta de columnas `auth.users` para evitar el 500 de login).
