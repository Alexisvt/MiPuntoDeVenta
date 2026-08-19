# Proposal: MVP de punto de venta simple

## Intent
Reemplazar el uso cotidiano del sistema actual por una herramienta mucho más simple para registrar ventas de un negocio pequeño. El valor no es “tener módulos”: es completar una jornada de ventas sin fricción.

## Scope

### In Scope
- Autenticación y administración básica de usuarios con roles.
- Catálogo e inventario de productos.
- Punto de venta: buscar/agregar productos, cobrar y emitir comprobante.
- Caja: apertura, cierre diario y resumen imprimible.
- Impresión de recibo interno no fiscal y cierre en impresora térmica POS.

### Out of Scope
- Replicar el menú o módulos no usados del sistema actual.
- Contabilidad, CRM, nómina, compras complejas, analítica avanzada y multi-sucursal.
- Facturación electrónica/Hacienda, facturas fiscales, devoluciones y descuentos.
- Decidir stack, proveedor de impresión o despliegue sin relevamiento técnico.

## Capabilities

### New Capabilities
- `user-access`: acceso y roles para operadores y administradores.
- `inventory-catalog`: productos y existencias disponibles para vender.
- `point-of-sale`: registro y cobro de ventas.
- `cash-day-close`: apertura, cierre y resumen de jornada.
- `thermal-printing`: recibos internos no fiscales y cierres imprimibles en formato POS.

### Modified Capabilities
- None — no existen specs base.

## Approach
Diseñar un monolito modular con navegación reducida a los flujos usados. Primero definir reglas y contratos de dominio independientes de tecnología; luego seleccionar stack e integración de impresión compatible con el hardware real.

## Affected Areas
| Area | Impact | Description |
|---|---|---|
| `openspec/specs/` | New | Especificaciones de las cinco capacidades. |
| Aplicación aún no inicializada | New | Implementación posterior al diseño y tareas. |
| Impresora POS | External dependency | Requiere modelo, conexión y protocolo. |

## Risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| Confundir recibo interno con factura fiscal | High | Etiquetar el documento como no fiscal; la factura solicitada se emite manualmente. |
| Hardware no compatible | Medium | Probar con modelo real y definir un adaptador de impresión. |
| Alcance crece como sistema anterior | High | Mantener fuera de alcance módulos no usados y validar cada incremento. |

## Rollback Plan
El cambio es solo de planificación. Si se invalida, se elimina/archiva `mvp-pos-simple` sin afectar código productivo.

## Dependencies
- Validación del dueño del negocio sobre procesos, roles y reglas.
- Epson TM-T20II, gaveta 3nstar y validación de la interfaz/conexión instalada.

## Success Criteria
- [ ] Una persona operadora puede completar apertura → venta → cierre sin usar módulos extra.
- [ ] Los roles restringen las acciones administrativas definidas.
- [ ] Venta y cierre producen una salida apta para la impresora POS confirmada.
- [ ] El alcance MVP queda aprobado antes de iniciar implementación.

