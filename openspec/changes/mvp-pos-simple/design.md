# Design: MVP de punto de venta simple

## Technical Approach
Implementar un monolito modular organizado por capacidades: acceso, inventario, venta, caja e impresión. La aplicación prioriza el recorrido operativo: iniciar sesión → abrir caja → vender → imprimir → cerrar caja. El stack, persistencia concreta y protocolo de impresora se decidirán antes de aplicar tareas.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|---|---|---|---|
| Límites de dominio | Módulos por capacidad con contratos explícitos | Pantallas acopladas a una base de datos | Las reglas de venta, caja e inventario deben cambiar sin contagiar el resto. |
| Caja como contexto | Toda venta exige una caja abierta | Venta independiente de la caja | Hace auditables la jornada, el operador y los totales de cierre. |
| Impresión MVP | Impresión desde navegador/SO mediante el driver Epson configurado | Pulsos ESC/POS directos desde la UI | Mantiene el recibo interno desacoplado y aprovecha el flujo existente que abre la gaveta 3nstar al imprimir. |
| Experiencia UI | Superficie de producto clara, ágil y confiable | Replicar menú existente | Reduce carga cognitiva y capacitación del personal rotativo. |
| Accesibilidad | WCAG 2.2 AA y operación por teclado | Accesibilidad como mejora posterior | La velocidad y el foco visible benefician a cada cajero, no solo a casos especiales. |

## Compliance Boundary
El documento de venta será un **recibo interno no fiscal**. Cuando el cliente solicite factura legal, el negocio la emitirá manualmente en su talonario; Hacienda y facturación electrónica quedan fuera del MVP.

## Data Flow

    Usuario autenticado
        ↓
    Caja abierta ─→ POS ─→ Venta completada ─→ Recibo
        │              │          │
        └──────────────┴──────→ Inventario
        ↓
    Cierre diario ────────────→ Resumen impreso

Cada operación persistirá actor, marca de tiempo y referencia de caja. Un fallo de impresión NO revierte una venta ni un cierre: conserva un documento reintentable.

## Product UI Direction
**Escena**: un cajero trabaja bajo iluminación fuerte de mostrador, con fila y presión de tiempo; por eso la interfaz será clara de tema claro, alto contraste y una sola acción primaria por pantalla.

- Estrategia cromática **restrained**: neutros ligeramente cálidos y un acento solo para acción actual, selección y estado.
- App shell mínima: encabezado con usuario/caja, navegación visible solo para capacidades autorizadas.
- POS en dos zonas, catálogo/búsqueda y ticket actual; total y cobro siempre anclados, sin tarjetas decorativas.
- Caja y cierre como pasos lineales con resumen verificable; las confirmaciones irreversibles son explícitas e inline cuando sea posible.
- Estados obligatorios: carga, catálogo vacío, producto agotado, sin caja abierta, impresión fallida/reintento, acceso denegado y cierre exitoso.
- Teclado, foco visible, contraste AA, mensajes que no dependan solo del color y movimiento funcional de 150–250 ms.

## Planned File Changes

| Area | Action | Description |
|---|---|---|
| `src/modules/access/` | Create | Sesión, roles y autorización. |
| `src/modules/inventory/` | Create | Productos y existencias. |
| `src/modules/sales/` | Create | Venta, líneas y totales. |
| `src/modules/cash/` | Create | Apertura, jornada y cierre. |
| `src/modules/printing/` | Create | Contrato de recibos y adaptadores POS. |
| `src/app/` | Create | Flujos/pantallas accesibles y navegación mínima. |
| `tests/` | Create | Pruebas de reglas críticas y recorridos. |

Estas rutas son un blueprint, no una elección de framework.

## Interfaces / Contracts

- **Sale**: id, cashSessionId, operatorId, lines, total, paymentMethod, completedAt.
- **CashSession**: id, openedBy, openedAt, openingAmount, closedBy?, closedAt?, totals.
- **ReceiptPrinter**: recibe un documento de venta o cierre y devuelve resultado imprimible/reintentable.
- **Authorization**: evalúa acción y rol antes de exponer o ejecutar operación.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | Totales, stock, permisos y transición de caja | Pruebas deterministas de dominio. |
| Integration | Venta actualiza inventario y caja | Persistencia real o equivalente controlado. |
| E2E | Apertura → venta → cierre | Flujo de operador con impresora simulada. |
| Accessibility | Foco, teclado, contraste y mensajes | Auditoría automatizada y revisión manual. |

## Migration / Rollout
No existe sistema propio a migrar. Pilotear primero con el negocio amigo y datos de prueba; importar productos solo después de definir formato de origen.

## Open Questions
- [ ] ¿En qué país operará y qué obligaciones fiscales/factura electrónica existen?
- [ ] Métodos MVP confirmados: efectivo, tarjeta, SINPE y transferencia; devoluciones/descuentos excluidos.
- [ ] Epson TM-T20II y gaveta 3nstar confirmadas; falta verificar la interfaz física/configuración del driver.
- [ ] Stack elegido: Next.js + TypeScript + SQLite/Prisma; falta validar el modo de despliegue local en sitio.
