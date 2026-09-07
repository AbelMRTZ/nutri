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
| Fase 3 — Calendario, bloques futuros (consumo+puntuación, sustitución, repetición) | ⏳ Sin empezar |
| Fase 4 — Entrenamiento | ⏳ Sin empezar |

Commits hasta ahora (los más recientes primero):
```
(pendiente) Phase 3 / slice 1: Calendario (assign/remove plans per day, free days)
8f575a3 Add project status handoff + Calendario slice 1 prep work
e8fe14a Phase 2 / slice 3: Despensa → Planes
7ef6894 Phase 2 / slice 2: Despensa → Comidas
d0e99bb Phase 2 / slice 1: Despensa → Alimentos
ff58fc3 Apply "Vibrante/Enérgico" as the app's permanent design system
812732b Phase 1: auth, personalization onboarding, and app shell
```

## Qué hay ya construido (Fases 1-3 bloque 1)

Arquitectura de referencia — leer el código es más fiable que resumirlo aquí, pero como mapa rápido:

- `src/features/<feature>/` por cada dominio (`auth`, `profile`, `foods`, `meals`, `plans`, `calendar`, `pantry`, `home`, `settings`, `app-shell`), cada uno con `schema.ts` (zod + opciones/labels) si hace falta, `api/` (wrappers finos de Supabase, lanzan en error), `hooks/` (TanStack Query, una función por hook, claves `xQueryKey(...)`), `mappers.ts` si hace falta, `components/`, `index.ts` (barrel — las features solo se importan entre sí a través de él, nunca con rutas internas, **excepto** los módulos de cálculo puro tipo `contribution.ts`/`totals.ts`, que se importan por su ruta concreta para no arrastrar dependencias nativas a los tests de Jest).
- `src/components/`: primitivas compartidas (`Screen`, `ThemedText`, `Button`, `TextField`, `NumericField`, `OptionPicker`, `LabeledSlider`, `FieldLabel`, `PlaceholderScreen`, `FullScreenSpinner`, `ConfirmDialog`, `CollapsibleSection`, `MacroDonutChart`, `TargetProgressBar`).
- `src/constants/theme.ts` + `src/hooks/use-theme.ts`: identidad visual "Vibrante/Enérgico" (negro casi puro estructural, coral `accent` para selección, lima `accentSecondary` para progreso, radios 10-14px, bordes sólidos 1.5px, tipografías Space Grotesk/Work Sans).
- `src/hooks/use-themed-stack-options.ts`: opciones de cabecera compartidas para cualquier `Stack`.
- `src/lib/dates.ts`: helpers de fecha sin librería externa (`toDateKey`/`fromDateKey`, `addDays`, `isSameDay`, `isToday`, `formatChipWeekday`, `formatDisplayDate` vía `Intl.DateTimeFormat('es-ES', ...)`).
- Patrón de rutas: cada sección de una tab que necesita varias pantallas se convierte en un directorio con su propio `_layout.tsx` (Stack), y la tab padre (`(tabs)/_layout.tsx`) pasa esa entrada a `headerShown:false` — ver `despensa/_layout.tsx` → `despensa/comidas/_layout.tsx` → `despensa/planes/_layout.tsx` y ahora `calendario/_layout.tsx` como ejemplos ya construidos.
- Base de datos: `supabase/migrations/0001` a `0006` — `profiles`, `foods`, `meals`+`meal_items`, `plans`+`plan_items`+`plan_item_foods`, `calendar_days`. Convenciones: enums de Postgres (no text+check) para catálogos fijos; toda tabla propia de usuario tiene `user_id` + 4 políticas RLS; una tabla hija sin `user_id` propio resuelve la propiedad vía `exists` contra su padre (y, si aplica, contra el dueño de una FK "ingrediente" como `food_id`/`meal_id`/`plan_id`, para que un cliente manipulado no pueda enlazar una fila ajena adivinando su uuid); una tabla referenciada por una hija usa FK RESTRICT (sin `on delete`) para que borrarla en uso lance `23503`, capturado por `src/lib/supabase/errors.ts` (`isForeignKeyViolation`/`friendlyDeleteErrorMessage`) — `calendar_days.plan_id` es el ejemplo más nuevo: borrar un plan asignado a un día ahora muestra el aviso amigable "en uso" en `PlanListItem`/`PlanDetailScreen`.
- `calendar_days` tiene una fila por `(user_id, date)` (constraint unique), mutuamente exclusiva entre `plan_id` asignado e `is_free` (check constraint); la ausencia de fila para una fecha significa "sin planificar" — la app nunca pre-crea filas para todas las fechas. `upsertCalendarDay` (en `src/features/calendar/api/calendarDays.ts`) usa `onConflict: 'user_id,date'` en vez de comprobar existencia primero.
- Lección aprendida importante (arrastre): **no usar librerías de arrastre basadas en gestos** (se probó `react-native-draggable-flatlist` para reordenar comidas en Planes; su medición interna usa `findNodeHandle`, no soportado en React Native Web, así que nunca se activaba el arrastre en `expo start --web`). Se sustituyó por botones de subir/bajar — funciona igual en todas las plataformas.
- Lección aprendida nueva (RNW + `FlatList` horizontal): un `FlatList`/`ScrollView` horizontal **sin `style` con altura explícita** se estira para ocupar todo el alto disponible del contenedor flex en React Native Web (aunque en iOS/Android se comporta bien) — pasó con `DayStrip` (los chips de día se estiraban a pantalla completa). Fix: darle al `FlatList` un `style` con `height` fija + `flexGrow: 0, flexShrink: 0`. Cualquier lista horizontal futura debe aplicar esto desde el principio y comprobarse visualmente en `expo start --web`, no solo con `tsc`.
- Verificación end-to-end de cada bloque: usuario de prueba creado por SQL directo (`auth.users`+`auth.identities`, confirmado sin email), Playwright contra `expo start --web`, borrado del usuario de prueba al terminar. **Detalle importante descubierto en este bloque:** insertar en `auth.users` a mano sin rellenar `email_change`, `email_change_token_new`, `email_change_token_current`, `phone_change`, `phone_change_token` y `reauthentication_token` (dejarlos en `NULL` por defecto) hace que el login por password devuelva `500` — el driver Go de GoTrue no puede escanear `NULL` en esas columnas `string`. Hay que poner esas columnas a `''` explícitamente al crear el usuario de prueba por SQL. `tsc --noEmit`, `npx jest`, `npx expo lint` deben quedar limpios antes de dar un bloque por cerrado, y `get_advisors` (Supabase) debe devolver 0 avisos de seguridad nuevos tras cada migración (el único aviso presente, `auth_leaked_password_protection`, es preexistente y no relacionado con el esquema de la app).
- Playwright no es una dependencia del proyecto (`node_modules`) pero está instalado globalmente vía nvm; para usarlo desde un script Node en este repo hace falta `NODE_PATH="$(npm root -g)" node script.js`.

## Qué hay construido en Calendario, bloque 1 (Fase 3)

- `src/features/calendar/`: `api/calendarDays.ts` (`getCalendarDay`, `listCalendarDaysInRange`, `upsertCalendarDay`, `deleteCalendarDay`), `hooks/` (`useCalendarDay`, `useCalendarDaysRange`, `useAssignPlanToDay`, `useMarkDayFree`, `useRemoveDayAssignment`), `components/` (`DayStrip` — tira horizontal de 29 días con indicador de color por día asignado/libre; `CalendarDayPanel` — estados sin planificar / libre / con plan asignado; `AssignedPlanSummary` — tarjeta con Editar/Quitar; `CalendarScreen` — pantalla raíz con estado de fecha seleccionada; `PlanAssignmentPickerScreen` + `PlanPickerListItem` — selector de plan al estilo `MealPickerScreen`), `index.ts` (barrel, solo expone `CalendarScreen` y `PlanAssignmentPickerScreen`, igual que `plans/index.ts` solo expone pantallas).
- Rutas: `calendario/_layout.tsx` (Stack, index con `TopBar`, `asignar-plan` con título), `calendario/index.tsx`, `calendario/asignar-plan.tsx` (lee `date` de `useLocalSearchParams`). Se borró el placeholder plano `calendario.tsx` y se cambió `calendario` a `headerShown:false` en `(tabs)/_layout.tsx`, igual que `despensa`.
- Verificado end-to-end con Playwright: asignar plan a un día (Estándar), "Editar" navega a `despensa/planes/[id]`, "Quitar" con `ConfirmDialog` vuelve a "sin planificar", "Marcar como libre" y "Quitar" sobre día libre, y borrar desde Despensa → Planes un plan asignado a un día muestra el aviso amigable "Este plan está en uso y no se puede eliminar." en vez de un error crudo (409 de PostgREST capturado).

## Después del bloque 1 de Calendario

Por orden: (2) seguimiento de comidas consumidas + resumen energético diario reutilizando `TargetProgressBar` + puntuación 0-100 → (3) sustitución inteligente de alimentos → (4) programación/repetición de planes. Después de Calendario, queda **Entrenamiento** como última fase grande del encargo original.
