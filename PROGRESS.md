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
| Fase 3 — Calendario, bloque 1 (asignar/quitar planes a días, marcar "Libre") | 🚧 **En curso, bloqueada** (ver más abajo) |
| Fase 3 — Calendario, bloques futuros (consumo+puntuación, sustitución, repetición) | ⏳ Sin empezar |
| Fase 4 — Entrenamiento | ⏳ Sin empezar |

Commits hasta ahora (los más recientes primero):
```
e8fe14a Phase 2 / slice 3: Despensa → Planes
7ef6894 Phase 2 / slice 2: Despensa → Comidas
d0e99bb Phase 2 / slice 1: Despensa → Alimentos
ff58fc3 Apply "Vibrante/Enérgico" as the app's permanent design system
812732b Phase 1: auth, personalization onboarding, and app shell
```

## Bloqueo activo ahora mismo

**El MCP de Supabase está desconectado en esta máquina/sesión.** Sin él no se pueden aplicar migraciones, regenerar `src/lib/supabase/database.types.ts`, ni comprobar el advisor de seguridad.

Diagnóstico ya hecho:
- `/mcp` en Claude Code muestra "No MCP servers are configured" — confiere que no hay configuración local (`.mcp.json` / `claude mcp add`).
- El conector "Supabase" SÍ aparece conectado en la app de escritorio de Claude, pero el puente hacia esta sesión concreta de Claude Code se cayó.
- **Solución más probable:** reiniciar la sesión de Claude Code (cerrar y reabrir el panel/ventana en VSCode, o abrir una conversación nueva) para que vuelva a sincronizar con los conectores activos de la cuenta.

**Antes de seguir con Calendario, comprobar si las herramientas `mcp__claude_ai_Supabase__*` ya están disponibles** (por ejemplo con una búsqueda de herramientas). Si lo están, seguir directamente por "Próximos pasos" abajo.

## Qué hay ya construido (Fases 1 y 2)

Arquitectura de referencia — leer el código es más fiable que resumirlo aquí, pero como mapa rápido:

- `src/features/<feature>/` por cada dominio (`auth`, `profile`, `foods`, `meals`, `plans`, `pantry`, `home`, `settings`, `app-shell`), cada uno con `schema.ts` (zod + opciones/labels), `api/` (wrappers finos de Supabase, lanzan en error), `hooks/` (TanStack Query, una función por hook, claves `xQueryKey(...)`), `mappers.ts` si hace falta, `components/`, `index.ts` (barrel — las features solo se importan entre sí a través de él, nunca con rutas internas, **excepto** los módulos de cálculo puro tipo `contribution.ts`/`totals.ts`, que se importan por su ruta concreta para no arrastrar dependencias nativas a los tests de Jest).
- `src/components/`: primitivas compartidas (`Screen`, `ThemedText`, `Button`, `TextField`, `NumericField`, `OptionPicker`, `LabeledSlider`, `FieldLabel`, `PlaceholderScreen`, `FullScreenSpinner`, `ConfirmDialog`, `CollapsibleSection`, `MacroDonutChart`, `TargetProgressBar`).
- `src/constants/theme.ts` + `src/hooks/use-theme.ts`: identidad visual "Vibrante/Enérgico" (negro casi puro estructural, coral `accent` para selección, lima `accentSecondary` para progreso, radios 10-14px, bordes sólidos 1.5px, tipografías Space Grotesk/Work Sans).
- `src/hooks/use-themed-stack-options.ts`: opciones de cabecera compartidas para cualquier `Stack`.
- Patrón de rutas: cada sección de una tab que necesita varias pantallas se convierte en un directorio con su propio `_layout.tsx` (Stack), y la tab padre (`(tabs)/_layout.tsx`) pasa esa entrada a `headerShown:false` — ver `despensa/_layout.tsx` → `despensa/comidas/_layout.tsx` → `despensa/planes/_layout.tsx` como los tres ejemplos ya construidos.
- Base de datos: `supabase/migrations/0001` a `0005` — `profiles`, `foods`, `meals`+`meal_items`, `plans`+`plan_items`+`plan_item_foods`. Convenciones: enums de Postgres (no text+check) para catálogos fijos; toda tabla propia de usuario tiene `user_id` + 4 políticas RLS; una tabla hija sin `user_id` propio resuelve la propiedad vía `exists` contra su padre (y, si aplica, contra el dueño de una FK "ingrediente" como `food_id`/`meal_id`, para que un cliente manipulado no pueda enlazar una fila ajena adivinando su uuid); una tabla referenciada por una hija usa FK RESTRICT (sin `on delete`) para que borrarla en uso lance `23503`, capturado por `src/lib/supabase/errors.ts` (`isForeignKeyViolation`/`friendlyDeleteErrorMessage`).
- Lección aprendida importante: **no usar librerías de arrastre basadas en gestos** (se probó `react-native-draggable-flatlist` para reordenar comidas en Planes; su medición interna usa `findNodeHandle`, no soportado en React Native Web, así que nunca se activaba el arrastre en `expo start --web`). Se sustituyó por botones de subir/bajar — funciona igual en todas las plataformas. Cualquier UI de reordenación futura debe seguir este mismo patrón (o verificar primero, con una prueba real, que una librería de gestos concreta sí funciona en web antes de construir la pantalla completa encima).
- Verificación end-to-end de cada bloque: usuario de prueba creado por SQL directo (`auth.users`+`auth.identities`, confirmado sin email), Playwright contra `expo start --web`, borrado del usuario de prueba al terminar. `tsc --noEmit`, `npx jest`, `npx expo lint` deben quedar limpios antes de dar un bloque por cerrado, y `get_advisors` (Supabase) debe devolver 0 avisos de seguridad tras cada migración.

## Qué hay a medio construir ahora mismo (Calendario, bloque 1)

**Ya creado y verificado con `tsc` (pero el bloque NO está terminado ni commiteado):**
- `src/lib/dates.ts` — helpers de fecha sin librería externa (`toDateKey`/`fromDateKey`, `addDays`, `isSameDay`, `isToday`, `formatChipWeekday`, `formatDisplayDate` vía `Intl.DateTimeFormat('es-ES', ...)`).
- `supabase/migrations/0006_calendar_days.sql` — **escrito pero NO aplicado a la base de datos real** (bloqueado por la desconexión del MCP). Crea `calendar_days` (user_id, date, plan_id nullable con FK RESTRICT a `plans`, is_free boolean, constraint de exclusión mutua libre/plan, unique(user_id,date)) + RLS de 4 políticas + trigger `set_updated_at`.

**Todavía sin crear:**
- `src/features/calendar/` completo (api/calendarDays.ts, hooks/, components/: `DayStrip`, `CalendarScreen`, `CalendarDayPanel`, `AssignedPlanSummary`, `PlanAssignmentPickerScreen`, index.ts).
- Rutas: borrar `src/app/(app)/(tabs)/calendario.tsx` (placeholder plano actual), crear `calendario/_layout.tsx`, `calendario/index.tsx`, `calendario/asignar-plan.tsx`.
- Cambio de una línea en `src/app/(app)/(tabs)/_layout.tsx`: la entrada `calendario` pasa a `headerShown:false`.

## Próximos pasos exactos (en cuanto el MCP de Supabase esté disponible)

1. Aplicar `supabase/migrations/0006_calendar_days.sql` (ya escrito, contenido completo en ese archivo).
2. Regenerar `src/lib/supabase/database.types.ts` (bloqueante para escribir código TS contra `Tables<'calendar_days'>`).
3. Comprobar `get_advisors` (esperar 0 avisos).
4. Construir `src/features/calendar/` y las rutas — el diseño completo (API exacta, componentes, props) está detallado en el plan de esta sesión; si no está disponible, el resumen de arriba + la migración ya escrita son suficientes para reconstruirlo desde cero siguiendo las convenciones ya establecidas en `src/features/plans/`.
5. Verificar end-to-end con Playwright (usuario de prueba por SQL): asignar plan a un día, editar navega a Planes, quitar plan con confirmación, marcar/desmarcar día libre, y confirmar que borrar un plan asignado a un día ahora muestra el aviso amigable "en uso" en vez de un error crudo.
6. `tsc`/`jest`/`expo lint` limpios → commit.

## Después del bloque 1 de Calendario

Por orden: (2) seguimiento de comidas consumidas + resumen energético diario reutilizando `TargetProgressBar` + puntuación 0-100 → (3) sustitución inteligente de alimentos → (4) programación/repetición de planes. Después de Calendario, queda **Entrenamiento** como última fase grande del encargo original.
