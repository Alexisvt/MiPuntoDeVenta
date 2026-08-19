<!--
Objetivo: permitir que una persona entienda el cambio, su riesgo y cómo validarlo
sin reconstruir la historia desde commits o conversaciones externas.

Completá lo relevante y marcá N/A cuando una sección no aplique. No borres los
controles de issue, tipo, pruebas, seguridad, despliegue ni rollback.
-->

## Resultado

<!-- En 2–4 líneas: qué cambia, para quién y por qué importa. -->

## Trabajo relacionado

Closes #<!-- issue aprobado -->

| Cadena de entrega | Enlace |
|---|---|
| PR anterior | N/A |
| PR siguiente | N/A |
| Spec / ADR / diseño | N/A |

## Ruta de revisión

<!-- Indicá por dónde empezar y qué archivos o decisiones merecen más atención. -->

1. 
2. 
3. 

### Fuera de alcance

<!-- Evita que el review se expanda a trabajo deliberadamente posterior. -->

- 

## Tipo de cambio

<!-- Marcá exactamente uno. El PR debe tener el label type:* equivalente. -->

- [ ] `type:feature` — funcionalidad nueva
- [ ] `type:bug` — corrección
- [ ] `type:refactor` — cambio interno sin alterar comportamiento
- [ ] `type:docs` — documentación
- [ ] `type:chore` — mantenimiento, plataforma o dependencias
- [ ] `type:breaking-change` — cambio incompatible

## Alcance técnico

| Área | Cambio | Impacto |
|---|---|---|
| Frontend | N/A | N/A |
| Backend / API | N/A | N/A |
| Datos / migraciones | N/A | N/A |
| Infraestructura / cloud | N/A | N/A |
| CI/CD / observabilidad | N/A | N/A |

### Decisiones y contratos

<!-- APIs, eventos, modelos, configuración, compatibilidad o tradeoffs relevantes. -->

- 

## Riesgo

**Nivel:** <!-- Bajo / Medio / Alto -->

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
|  |  |  |  |

## Seguridad, privacidad y cumplimiento

- [ ] Se revisaron autenticación, autorización y mínimo privilegio, o N/A.
- [ ] No se agregaron secretos, datos personales ni información sensible al repositorio.
- [ ] Entradas, errores, logs y dependencias se manejan de forma segura, o N/A.
- [ ] Se documentó cualquier impacto regulatorio, fiscal o de retención de datos, o N/A.

**Notas:** <!-- Amenazas consideradas, scanners, excepciones o N/A. -->

## Datos y compatibilidad

- [ ] La migración es compatible hacia atrás durante el despliegue, o N/A.
- [ ] Existe estrategia para rollback, backfill y datos parciales, o N/A.
- [ ] Se evaluaron contratos públicos, clientes existentes y versionado, o N/A.

**Notas:**

## Evidencia de calidad

| Verificación | Comando / evidencia | Resultado |
|---|---|---|
| Tests unitarios |  | ⬜ |
| Tests de integración |  | ⬜ |
| E2E / accesibilidad |  | ⬜ |
| Lint / análisis estático |  | ⬜ |
| Seguridad / dependencias |  | ⬜ |
| Infraestructura / configuración |  | ⬜ |

### Validación manual

<!-- Pasos reproducibles, datos usados y resultado esperado. -->

1. 

## Experiencia de usuario

- [ ] Estados de carga, vacío, error y éxito cubiertos, o N/A.
- [ ] Navegación por teclado, foco, contraste y lector de pantalla revisados, o N/A.
- [ ] Comportamiento responsive y textos de interfaz revisados, o N/A.
- [ ] Se adjunta evidencia visual cuando cambia la UI, o N/A.

## Preparación operativa

- [ ] Logs, métricas, trazas, alertas y health checks son suficientes, o N/A.
- [ ] Configuración, variables, permisos y secretos están documentados, o N/A.
- [ ] Runbook, soporte y respuesta ante fallos están actualizados, o N/A.
- [ ] El cambio tolera reintentos, despliegues parciales y fallos de dependencias, o N/A.

## Despliegue y rollback

**Plan de despliegue:**

1. 

**Validación posterior:**

1. 

**Señales para abortar o revertir:**

- 

**Plan de rollback:**

1. 

## Checklist final

- [ ] El issue enlazado tiene `status:approved`.
- [ ] El PR tiene exactamente un label `type:*`.
- [ ] El alcance coincide con la spec y lo fuera de alcance está explícito.
- [ ] Tests y documentación acompañan al comportamiento que verifican.
- [ ] CI requerido pasa sin excepciones ocultas.
- [ ] Commits siguen Conventional Commits y no incluyen atribución automática.
- [ ] El tamaño es revisable o la excepción / cadena de PRs está documentada.
- [ ] La persona revisora sabe qué validar primero.

## Notas para release

<!-- Cambio visible, migración, feature flag, comunicación o "Sin notas". -->

