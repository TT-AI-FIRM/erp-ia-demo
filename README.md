# ERP con asistente de IA · demo

Demo funcional (datos ilustrativos generados en el navegador) de un ERP completo con su propio asistente de IA, preparado por T.T AI Firm.

- `index.html` — portada de la propuesta (qué hace cada módulo, pantallas, Vera, con quiénes hemos trabajado).
- `app/` — el ERP: inicio con hallazgos, ventas (facturas, pedidos, clientes, vendedores), compras (órdenes, facturas de proveedor con detección de duplicadas, proveedores), inventario (existencias, catálogo, movimientos), finanzas (cobranza, cuentas por pagar, tesorería), informes tipo Power BI, Vera (asistente), personal y configuración. Accesos de ejemplo: `?rol=direccion|ventas|compras|almacen|finanzas`; `#vista` abre una pantalla; `&preg=` le hace una pregunta a Vera al entrar.
- `shared/core.js` — datos deterministas (24 meses, 4 sucursales, ~18 mil facturas) y el análisis (los números los saca el código). `shared/asistente.js` — Vera: entiende la pregunta y redacta sobre esos números; en la versión real la redacción la hace Claude / GPT con las mismas consultas de solo lectura.

Empresa ficticia: Comercial Altavista. Nada aquí es real.
