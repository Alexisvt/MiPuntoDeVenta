## Exploration: MVP de punto de venta simple

### Current State
El repositorio no contiene aplicación ni stack. Las capturas del sistema anterior muestran, por nombre, los recorridos a conservar como concepto: inicio de sesión, apertura/listado de caja, nueva factura, comprobante pagado en efectivo y cierre impreso. El usuario pidió ignorar el menú amplio del producto anterior.

### Affected Areas
- `openspec/changes/mvp-pos-simple/` — planificación inicial del producto.
- Futura aplicación — autenticación, inventario, venta, caja/cierre e impresión térmica.

### Approaches
1. **MVP modular centrado en flujos** — construir solo los cinco flujos solicitados, con navegación mínima.
   - Pros: reduce complejidad, valida rápido con el negocio real.
   - Cons: algunos reportes y módulos quedan para después.
   - Effort: Medium.

2. **Replicar el sistema actual y simplificar luego** — copiar módulos/menús del producto existente.
   - Pros: mayor cobertura aparente.
   - Cons: repite exactamente el problema identificado; eleva costo y aprendizaje.
   - Effort: High.

### Recommendation
Adoptar el MVP modular centrado en flujos. La unidad operativa es la jornada de caja: abrir, registrar ventas, cerrar e imprimir; inventario y usuarios la sostienen. La elección de stack, modelo de impresión y reglas fiscales debe decidirse en diseño tras relevar el hardware y país.

### Risks
- El país y la obligación de factura electrónica no están definidos.
- La impresora térmica, conectividad y protocolo (USB/red/Bluetooth/ESC-POS) no están identificados.
- Faltan reglas de inventario, pagos, devoluciones, impuestos y permisos por rol.
- Sin stack ni test runner, aún no puede activarse TDD.

### Ready for Proposal
Yes — propuesta de MVP, con decisiones técnicas y reglas de negocio explícitamente diferidas.
