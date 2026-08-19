# Tasks: MVP de punto de venta simple

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 1,800–3,000 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | Foundation → acceso/inventario → venta/caja → impresión/UI |
| Delivery strategy | ask-on-risk |
| Chain strategy | feature-branch-chain |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|---|---|---|---|
| 1 | Stack, modelo y base accesible | PR 1 | Base = feature/tracker branch; sin funcionalidad comercial. |
| 2 | Acceso e inventario | PR 2 | Base = PR 1 branch; roles, productos y stock. |
| 3 | Venta y caja | PR 3 | Base = PR 2 branch; recorrido operativo completo. |
| 4 | Impresión, accesibilidad y piloto | PR 4 | Base = PR 3 branch; hardware adaptado y flujos E2E. |

## Phase 1: Foundation

- [x] 1.1 Confirmar Costa Rica, recibo interno no fiscal, pagos MVP, exclusiones y Epson TM-T20II con gaveta 3nstar.
- [ ] 1.2 Configurar Next.js/TypeScript, SQLite/Prisma, autenticación y despliegue local; actualizar `openspec/config.yaml`.
- [ ] 1.3 Crear estructura modular `src/modules/{access,inventory,sales,cash,printing}/` y contratos de dominio.
- [ ] 1.4 Crear esquema de datos para usuarios/roles, productos, stock, ventas, líneas y sesiones de caja.
- [ ] 1.5 Establecer runner de pruebas, lint, tipos y pruebas de accesibilidad; habilitar TDD.

## Phase 2: Access and Inventory

- [ ] 2.1 RED: probar inicio de sesión y autorización por rol según `user-access`.
- [ ] 2.2 GREEN: implementar sesión, usuarios, roles y estados de usuario en `src/modules/access/`.
- [ ] 2.3 RED/GREEN: implementar productos activos/inactivos y stock insuficiente en `src/modules/inventory/`.
- [ ] 2.4 Crear pantallas de usuarios y productos con foco visible, teclado, estados vacíos y error.

## Phase 3: Sales and Cash

- [ ] 3.1 RED/GREEN: implementar apertura única, cierre y transiciones de `CashSession`.
- [ ] 3.2 RED/GREEN: implementar venta con líneas, totales, pago y asociación obligatoria a caja/operador.
- [ ] 3.3 Integrar descuento de inventario atómico al completar una venta.
- [ ] 3.4 Construir POS de dos zonas, ticket anclado, búsqueda y cobro rápido sin navegación extra.
- [ ] 3.5 Crear vista lineal de apertura/cierre con resumen verificable y confirmación de acciones irreversibles.

## Phase 4: Printing and Validation

- [ ] 4.1 Definir `ReceiptPrinter` y adaptadores para navegador/simulador y el protocolo de impresora confirmado.
- [ ] 4.2 Renderizar recibos de venta/cierre, persistir reintentos y comunicar fallas de impresión.
- [ ] 4.3 E2E: apertura → venta → impresión → cierre con impresora simulada.
- [ ] 4.4 Auditar WCAG 2.2 AA, teclado, foco, contraste, movimientos reducidos y estados de error.
- [ ] 4.5 Pilotear con el negocio, registrar fricción y archivar decisiones de alcance.

