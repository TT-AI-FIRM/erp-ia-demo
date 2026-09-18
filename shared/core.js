/* ERP demo · núcleo de datos y análisis
   Empresa ILUSTRATIVA: Comercial Altavista, S.A. de C.V. (distribuidora de materiales y herramienta).
   Todos los datos se generan de forma determinista (misma semilla → mismos números) y se complementan
   con los cambios que el usuario hace en el demo (localStorage). Nada aquí es real. */
(function () {
  const HOY = new Date(2026, 8, 18, 9, 0, 0); // fecha fija del demo: 18-sep-2026
  const INICIO = new Date(2024, 8, 1);       // 24 meses de historia
  function rng(seed) { let a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const R = rng(20260918);
  const between = (a, b) => a + R() * (b - a), pick = (arr) => arr[Math.floor(R() * arr.length)], irand = (a, b) => Math.floor(between(a, b + 1));
  const pad = (n, l = 2) => String(n).padStart(l, '0');
  const iso = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const diasEntre = (a, b) => Math.round((parse(b) - parse(a)) / 86400000);
  const ymDe = (s) => s.slice(0, 7);
  const round2 = (n) => Math.round(n * 100) / 100;
  const HOY_ISO = iso(HOY);
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const MESES_CORTO = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  // ---------- catálogos ----------
  const EMPRESA = { nombre: 'Comercial Altavista, S.A. de C.V.', corto: 'Altavista', giro: 'Distribución de materiales, herramienta y suministros industriales', rfc: 'CAL980512XX0', moneda: 'MXN', iva: 0.16 };
  const SUCURSALES = [
    { id: 's1', nombre: 'Norte', ciudad: 'Monterrey, N.L.', factor: 1.18, crecimiento: 0.112, precio: 1.02, lugares: ['San Pedro', 'Apodaca', 'Guadalupe', 'Santa Catarina', 'Escobedo', 'Regia', 'del Norte', 'Cumbres'] },
    { id: 's2', nombre: 'Centro', ciudad: 'Ciudad de México', factor: 1.30, crecimiento: 0.068, precio: 1.00, lugares: ['Santa Fe', 'Polanco', 'Tlalnepantla', 'Naucalpan', 'Vallejo', 'Iztapalapa', 'del Valle', 'Azcapotzalco'] },
    { id: 's3', nombre: 'Sur', ciudad: 'Puebla, Pue.', factor: 0.86, crecimiento: 0.041, precio: 0.99, lugares: ['Angelópolis', 'Cholula', 'Atlixco', 'Amozoc', 'Tehuacán', 'La Paz', 'Huejotzingo', 'San Andrés'] },
    { id: 's4', nombre: 'Oriente', ciudad: 'Veracruz, Ver.', factor: 0.66, crecimiento: -0.07, precio: 0.985, lugares: ['del Puerto', 'Boca del Río', 'Coatzacoalcos', 'Orizaba', 'Xalapa', 'Córdoba', 'Minatitlán', 'Veracruz'] }
  ];
  const LINEAS = [
    { id: 'l1', nombre: 'Herramienta', margen: 0.32 }, { id: 'l2', nombre: 'Eléctrico', margen: 0.28 }, { id: 'l3', nombre: 'Plomería', margen: 0.35 },
    { id: 'l4', nombre: 'Pinturas y acabados', margen: 0.30 }, { id: 'l5', nombre: 'Construcción', margen: 0.18 }, { id: 'l6', nombre: 'Seguridad industrial', margen: 0.40 }
  ];
  const CAT_PROD = {
    l1: [['Taladro percutor 1/2" 650 W', 'pza', 1180], ['Esmeril angular 4 1/2" 850 W', 'pza', 940], ['Rotomartillo SDS 800 W', 'pza', 2650], ['Sierra circular 7 1/4"', 'pza', 1890], ['Juego de llaves combinadas 12 pzas', 'jgo', 620], ['Caja de herramientas 20"', 'pza', 385], ['Martillo de bola 16 oz', 'pza', 165], ['Nivel de aluminio 24"', 'pza', 240], ['Flexómetro 8 m', 'pza', 118], ['Pinza de presión 10"', 'pza', 145], ['Desarmadores juego 6 pzas', 'jgo', 210], ['Escalera de tijera 6 peldaños', 'pza', 1420]],
    l2: [['Cable THW cal. 12 (rollo 100 m)', 'rollo', 1560], ['Cable THW cal. 10 (rollo 100 m)', 'rollo', 2380], ['Interruptor termomagnético 1P 20 A', 'pza', 128], ['Centro de carga 8 circuitos', 'pza', 690], ['Contacto dúplex polarizado', 'pza', 42], ['Apagador sencillo', 'pza', 36], ['Tubo conduit PVC 3/4" (3 m)', 'tramo', 58], ['Lámpara LED 18 W', 'pza', 74], ['Reflector LED 50 W', 'pza', 285], ['Cinta de aislar 18 m', 'pza', 24], ['Caja galvanizada 4x4', 'pza', 31], ['Extensión uso rudo 15 m', 'pza', 390]],
    l3: [['Tubo CPVC 1/2" (3 m)', 'tramo', 96], ['Tubo PVC sanitario 4" (6 m)', 'tramo', 410], ['Codo cobre 1/2"', 'pza', 28], ['Llave de paso 1/2"', 'pza', 112], ['Tinaco 1,100 L', 'pza', 2650], ['Bomba periférica 1/2 HP', 'pza', 1480], ['Calentador de paso 6 L', 'pza', 2980], ['Válvula check 3/4"', 'pza', 236], ['Manguera 1/2" 30 m', 'pza', 320], ['Cemento para PVC 250 ml', 'pza', 68], ['Cinta teflón 1/2"', 'pza', 14], ['Regadera cromada', 'pza', 345]],
    l4: [['Pintura vinílica blanca 19 L', 'cubeta', 1090], ['Esmalte alquidálico 4 L', 'galón', 420], ['Sellador acrílico 19 L', 'cubeta', 760], ['Impermeabilizante 5 años 19 L', 'cubeta', 1580], ['Thinner estándar 4 L', 'galón', 145], ['Brocha 4"', 'pza', 62], ['Rodillo 9" con charola', 'jgo', 95], ['Lija de agua 220', 'pliego', 9], ['Masilla 1 kg', 'pza', 48], ['Barniz marino 1 L', 'pza', 210], ['Cinta masking 24 mm', 'pza', 32], ['Espátula 3"', 'pza', 38]],
    l5: [['Cemento gris 50 kg', 'saco', 218], ['Mortero 50 kg', 'saco', 168], ['Varilla 3/8" (12 m)', 'pza', 245], ['Alambre recocido 25 kg', 'rollo', 690], ['Block hueco 15x20x40', 'pza', 15.5], ['Malla electrosoldada 6-6', 'rollo', 1650], ['Adhesivo para cerámica 20 kg', 'saco', 142], ['Yeso 40 kg', 'saco', 128], ['Cal hidratada 25 kg', 'saco', 96], ['Carretilla 6 ft³', 'pza', 1380], ['Pala cuadrada', 'pza', 265], ['Cimbra triplay 16 mm', 'hoja', 820]],
    l6: [['Casco de seguridad', 'pza', 118], ['Lentes de seguridad claros', 'pza', 38], ['Guantes de carnaza', 'par', 64], ['Botas dieléctricas', 'par', 780], ['Arnés de cuerpo completo', 'pza', 1240], ['Chaleco reflejante', 'pza', 85], ['Tapones auditivos (caja 100)', 'caja', 310], ['Respirador N95 (caja 20)', 'caja', 265], ['Cono vial 28"', 'pza', 168], ['Extintor PQS 6 kg', 'pza', 890], ['Botiquín industrial', 'pza', 640], ['Faja lumbar', 'pza', 210]]
  };
  const NOMBRES = ['Alejandra Ruiz', 'Rodrigo Salinas', 'Mariana Ortega', 'Héctor Villarreal', 'Paola Cantú', 'Diego Ferrer', 'Lucía Anaya', 'Andrés Robles', 'Carolina Méndez', 'Javier Escobedo', 'Renata Solís', 'Ernesto Ibarra', 'Fernanda Lozano', 'Gabriel Zúñiga', 'Daniela Torres', 'Iván Carrillo', 'Sofía Barrera', 'Raúl Peña', 'Valeria Camacho', 'Luis Treviño', 'Ximena Aguirre', 'Óscar Delgado', 'Regina Fuentes', 'Emilio Navarro', 'Ana Paula Cortés', 'Sebastián Rangel', 'Miriam Estrada', 'Tomás Galván', 'Natalia Ochoa', 'Arturo Medina', 'Elena Quiroga', 'Marco Villaseñor', 'Julieta Ríos', 'Pablo Sandoval', 'Camila Duarte', 'Ricardo Arévalo', 'Isabel Montes', 'Fabián Reyna', 'Adriana Leal', 'Gerardo Nieto', 'Montserrat Vela', 'Cristian Padilla', 'Laura Espinoza', 'Mauricio Garza', 'Vanessa Portillo', 'Alonso Bravo', 'Irene Castañeda', 'Patricio Olvera'];
  const GIROS = ['Constructora', 'Ferretería', 'Industrias', 'Mantenimiento', 'Grupo Constructor', 'Materiales', 'Instalaciones', 'Servicios Eléctricos', 'Desarrollos', 'Talleres', 'Inmobiliaria', 'Obras y Proyectos'];
  const SUFIJOS = ['S.A. de C.V.', 'S. de R.L. de C.V.', 'S.A.P.I. de C.V.', 'S.A. de C.V.', 'S.A. de C.V.'];
  const PROV_NOMBRES = { l1: ['Herramientas del Bajío', 'Ferretera Industrial Monterrey', 'Importadora Truper Distribución', 'Máquinas y Equipos Robles'], l2: ['Conductores Eléctricos del Centro', 'Eléctrica Nacional', 'Iluminación LED de México', 'Materiales Eléctricos Garza'], l3: ['Tubería y Conexiones Hidráulicas', 'Plásticos Industriales del Golfo', 'Bombas y Calentadores Rotoplas Distribución', 'Cobre y Válvulas del Norte'], l4: ['Pinturas Comex Distribuidor Mayorista', 'Recubrimientos Berel Mayoreo', 'Acabados y Solventes del Valle', 'Impermeabilizantes del Sureste'], l5: ['Cementos del Golfo', 'Aceros y Varillas Nacionales', 'Blocks y Prefabricados Puebla', 'Agregados y Morteros Regios'], l6: ['Equipo de Protección Industrial', 'Seguridad Laboral 3M Distribución', 'Extintores y Señalización', 'Calzado Industrial del Norte'] };
  const PUESTOS = ['Vendedor', 'Almacenista', 'Chofer repartidor', 'Auxiliar administrativo', 'Cajero', 'Comprador', 'Analista de crédito', 'Supervisor de almacén', 'Gerente de sucursal', 'Contador'];

  // ---------- generación ----------
  const db = { empresa: EMPRESA, sucursales: SUCURSALES, lineas: LINEAS, productos: [], vendedores: [], clientes: [], proveedores: [], personal: [], facturas: [], lineasVenta: [], pagos: [], cotizaciones: [], pedidos: [], ordenes: [], facturasProv: [], pagosProv: [], existencias: [], bancos: [], movBanco: [], encargos: [], bitacora: [], definiciones: [] };

  // productos
  LINEAS.forEach((l, li) => CAT_PROD[l.id].forEach(([nombre, unidad, costo], i) => {
    const m = l.margen * between(0.85, 1.15); const sku = 'AV-' + (li + 1) + pad(i + 1, 2) + '-' + irand(100, 999);
    db.productos.push({ id: 'p' + l.id.slice(1) + pad(i + 1), sku, nombre, unidad, linea: l.id, costo, precio: round2(costo * (1 + m)), rotacion: between(0.4, 1.6), minimo: irand(8, 40), proveedor: null });
  }));
  // proveedores (4 por línea); el planteado con aumento del 12 % es el de aceros (l5[1])
  LINEAS.forEach((l) => PROV_NOMBRES[l.id].forEach((nombre, i) => {
    const id = 'v' + l.id.slice(1) + (i + 1);
    db.proveedores.push({ id, nombre: nombre + ', ' + pick(SUFIJOS), linea: l.id, rfc: 'PRV' + irand(100000, 999999) + 'XX' + irand(1, 9), credito: pick([15, 30, 30, 45]), contacto: pick(NOMBRES), telefono: '55 ' + irand(1000, 9999) + ' ' + irand(1000, 9999), factor: between(0.93, 1.06), aumento: (l.id === 'l5' && i === 1) ? { desde: '2026-06-15', pct: 0.12 } : null, ciudad: pick(['Monterrey', 'CDMX', 'Guadalajara', 'Puebla', 'Querétaro', 'Veracruz']) });
  }));
  db.productos.forEach(p => { const provs = db.proveedores.filter(v => v.linea === p.linea); p.proveedor = pick(provs).id; });
  // proveedores de servicios y gastos (sin orden de compra): fletes, mantenimiento, telefonía, limpieza, papelería, energía
  [['Fletes y Logística del Norte', 'Fletes', 4200, 11800], ['Mantenimiento de Montacargas Ríos', 'Mantenimiento', 2800, 9500], ['Telecomunicaciones Empresariales MX', 'Telefonía e internet', 3100, 4900], ['Limpieza Integral Corporativa', 'Limpieza', 5600, 7400], ['Papelería y Consumibles Oficina Total', 'Papelería', 900, 3800], ['Suministro Eléctrico Comercial', 'Energía', 6200, 14800]].forEach(([nombre, rubro, min, max], i) => db.proveedores.push({ id: 'vs' + (i + 1), nombre: nombre + ', ' + pick(SUFIJOS), linea: null, rubro, rfc: 'SRV' + irand(100000, 999999) + 'XX' + irand(1, 9), credito: pick([15, 30]), contacto: pick(NOMBRES), telefono: '55 ' + irand(1000, 9999) + ' ' + irand(1000, 9999), factor: 1, aumento: null, ciudad: pick(['Monterrey', 'CDMX', 'Puebla', 'Veracruz']), rango: [min, max] }));
  // vendedores (3 por sucursal)
  let ni = 0; SUCURSALES.forEach((s) => { for (let k = 0; k < 3; k++) db.vendedores.push({ id: 'u' + (db.vendedores.length + 1), nombre: NOMBRES[ni++], sucursal: s.id, meta: 0, ingreso: iso(addDays(INICIO, -irand(200, 2400))) }); });
  // clientes (21 por sucursal); 3 grandes de Oriente dejan de comprar desde julio-2026
  SUCURSALES.forEach((s, si) => {
    for (let k = 0; k < 21; k++) {
      const tam = k < 3 ? 'grande' : (k < 10 ? 'mediano' : 'chico');
      const giro = pick(GIROS); const nombre = giro + ' ' + pick(s.lugares) + (R() < .5 ? ' ' + pick(['Norte', 'Sur', 'Plus', 'Industrial', 'Express', 'y Asociados', 'del Centro', 'MX']) : '');
      const vend = db.vendedores.filter(v => v.sucursal === s.id)[k % 3];
      const perfil = R() < .66 ? 'puntual' : (R() < .8 ? 'lento' : 'moroso');
      const credito = tam === 'grande' ? pick([45, 60]) : (tam === 'mediano' ? pick([30, 45]) : pick([0, 0, 15, 30]));
      const c = { id: 'c' + si + pad(k + 1), nombre: nombre + ', ' + pick(SUFIJOS), rfc: nombre.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X') + irand(100000, 999999) + 'XX' + irand(0, 9), sucursal: s.id, vendedor: vend.id, tamano: tam, giro, credito, limite: tam === 'grande' ? irand(8, 20) * 100000 : (tam === 'mediano' ? irand(2, 8) * 100000 : irand(3, 15) * 10000), perfil, contacto: pick(NOMBRES), correo: '', telefono: '', alta: iso(addDays(INICIO, -irand(30, 2000))), lineasPref: [pick(LINEAS).id, pick(LINEAS).id, pick(LINEAS).id], inactivoDesde: (s.id === 's4' && k >= 3 && k < 6) ? '2026-07-01' : null, frecuencia: tam === 'grande' ? 6.5 : (tam === 'mediano' ? 2.6 : 0.9) };
      c.correo = 'compras@' + nombre.toLowerCase().replace(/[^a-z]/g, '').slice(0, 14) + '.com.mx'; c.telefono = pick(['81', '55', '222', '229']) + ' ' + irand(1000, 9999) + ' ' + irand(1000, 9999);
      db.clientes.push(c);
    }
  });
  // personal
  SUCURSALES.forEach((s) => { PUESTOS.forEach((puesto) => { const n = puesto === 'Vendedor' ? 0 : (puesto === 'Gerente de sucursal' || puesto === 'Contador' ? 1 : irand(1, 3)); for (let k = 0; k < n; k++) db.personal.push({ id: 'e' + (db.personal.length + 1), nombre: NOMBRES[(ni++) % NOMBRES.length], puesto, sucursal: s.id, ingreso: iso(addDays(HOY, -irand(90, 3600))), sueldo: puesto.startsWith('Gerente') ? irand(38, 52) * 1000 : (puesto === 'Contador' ? irand(24, 32) * 1000 : irand(9, 18) * 1000) }); }); });
  db.vendedores.forEach(v => db.personal.push({ id: 'e' + (db.personal.length + 1), nombre: v.nombre, puesto: 'Vendedor', sucursal: v.sucursal, ingreso: v.ingreso, sueldo: irand(12, 16) * 1000, vendedor: v.id }));

  // ventas: 24 meses
  const estacion = [0.86, 0.94, 1.06, 1.08, 1.10, 1.06, 0.98, 1.00, 0.93, 1.07, 1.05, 0.80]; // ene..dic (construcción)
  const mesesDesde = (d) => (d.getFullYear() - INICIO.getFullYear()) * 12 + d.getMonth() - INICIO.getMonth();
  const indiceCosto = (d) => Math.pow(1.0035, mesesDesde(d)); // inflación de costos ≈ 4.3 % anual
  let folio = 48210, folioPed = 7040, folioCot = 11020, folioOC = 3110;
  const pesos = { grande: 6.5, mediano: 2.6, chico: 0.9 };
  function clienteAleatorio(s, fecha) { const cs = db.clientes.filter(c => c.sucursal === s.id && !(c.inactivoDesde && fecha >= c.inactivoDesde)); const tot = cs.reduce((a, c) => a + pesos[c.tamano], 0); let r = R() * tot; for (const c of cs) { r -= pesos[c.tamano]; if (r <= 0) return c; } return cs[cs.length - 1]; }
  for (let d = new Date(INICIO); d <= HOY; d = addDays(d, 1)) {
    const dow = d.getDay(); if (dow === 0) continue; const fd = dow === 6 ? 0.55 : 1;
    const fecha = iso(d); const mes = d.getMonth(); const anios = mesesDesde(d) / 12;
    SUCURSALES.forEach((s) => {
      let n = 7.2 * s.factor * estacion[mes] * fd * Math.pow(1 + s.crecimiento, anios) * between(0.86, 1.14);
      const cnt = Math.round(n);
      for (let k = 0; k < cnt; k++) {
        const c = clienteAleatorio(s, fecha); const nl = c.tamano === 'grande' ? irand(2, 6) : (c.tamano === 'mediano' ? irand(1, 4) : irand(1, 3));
        const f = { id: 'F' + (folio++), fecha, sucursal: s.id, cliente: c.id, vendedor: c.vendedor, subtotal: 0, iva: 0, total: 0, costo: 0, credito: c.credito, vence: iso(addDays(d, c.credito)), estado: 'pendiente', pagado: 0, fechaPago: null };
        const precioSuc = s.precio * (s.id === 's4' ? (1 - Math.max(0, (mesesDesde(d) - 18)) * 0.004) : 1); // Oriente baja precios desde marzo-2026
        for (let j = 0; j < nl; j++) {
          const linea = R() < .7 ? pick(c.lineasPref) : pick(LINEAS).id; const p = pick(db.productos.filter(x => x.linea === linea));
          const esGrande = c.tamano === 'grande'; const cant = p.costo < 60 ? irand(esGrande ? 40 : 10, esGrande ? 220 : 100) : (p.costo < 500 ? irand(esGrande ? 6 : 2, esGrande ? 36 : 16) : irand(1, esGrande ? 8 : 4));
          let costoU = p.costo * indiceCosto(d); const prov = db.proveedores.find(v => v.id === p.proveedor); if (prov && prov.aumento && fecha >= prov.aumento.desde) costoU *= 1 + prov.aumento.pct;
          let precioU = p.precio * indiceCosto(d) * precioSuc * between(0.96, 1.04); const desc = esGrande ? pick([0, 0, 0.03, 0.05, 0.08]) : pick([0, 0, 0, 0.02]);
          // margen negativo plantado: cemento y varilla en Centro desde el aumento del proveedor (nadie actualizó el precio de lista)
          if (s.id === 's2' && prov && prov.aumento && fecha >= prov.aumento.desde && (p.nombre.startsWith('Cemento gris') || p.nombre.startsWith('Varilla'))) precioU = costoU * 0.94;
          const importe = round2(cant * precioU * (1 - desc));
          db.lineasVenta.push({ factura: f.id, fecha, sucursal: s.id, cliente: c.id, vendedor: c.vendedor, producto: p.id, linea: p.linea, cant, precio: round2(precioU), desc, importe, costo: round2(cant * costoU) });
          f.subtotal += importe; f.costo += cant * costoU;
        }
        f.subtotal = round2(f.subtotal); f.iva = round2(f.subtotal * EMPRESA.iva); f.total = round2(f.subtotal + f.iva); f.costo = round2(f.costo);
        // pago según perfil
        let retraso = c.credito === 0 ? 0 : (c.perfil === 'puntual' ? irand(-6, 4) : (c.perfil === 'lento' ? irand(8, 45) : (R() < .04 ? null : irand(50, 140))));
        if (retraso !== null) { const fp = iso(addDays(parse(f.vence), retraso)); if (fp <= HOY_ISO) { f.estado = 'pagada'; f.pagado = f.total; f.fechaPago = fp; db.pagos.push({ id: 'P' + f.id.slice(1), factura: f.id, cliente: c.id, fecha: fp, monto: f.total, forma: pick(['transferencia', 'transferencia', 'transferencia', 'cheque', 'efectivo']), banco: 'b' + irand(1, 3) }); } }
        if (f.estado !== 'pagada') f.estado = f.vence < HOY_ISO ? 'vencida' : 'pendiente';
        db.facturas.push(f);
      }
    });
  }
  // calibración: cada sucursal-mes se lleva a un objetivo suave (tamaño × estacionalidad × tendencia × inflación ± 3 %)
  (function () { const B = 4000000; const obj = {}, act = {}; db.lineasVenta.forEach(l => { const k = l.sucursal + '|' + ymDe(l.fecha); act[k] = (act[k] || 0) + l.importe; });
    Object.keys(act).forEach(k => { const [sid, ym] = k.split('|'); const s = idx0(sid); const [y, m] = ym.split('-').map(Number); const d = new Date(y, m - 1, 15); const anios = mesesDesde(d) / 12; let o = B * s.factor * estacion[m - 1] * Math.pow(1 + s.crecimiento, anios) * indiceCosto(d) * between(0.97, 1.03); if (ym === ymDe(HOY_ISO)) o *= HOY.getDate() / 30; obj[k] = o / act[k]; });
    const costoU = {}; db.lineasVenta.forEach(l => { const k = l.sucursal + '|' + ymDe(l.fecha); const f = obj[k] || 1; const cu = l.costo / l.cant; const cant = Math.max(1, Math.round(l.cant * f)); l.cant = cant; l.importe = round2(cant * l.precio * (1 - l.desc)); l.costo = round2(cant * cu); });
    const porFac = {}; db.lineasVenta.forEach(l => { porFac[l.factura] = porFac[l.factura] || { sub: 0, costo: 0 }; porFac[l.factura].sub += l.importe; porFac[l.factura].costo += l.costo; });
    db.facturas.forEach(f => { const t = porFac[f.id]; f.subtotal = round2(t.sub); f.iva = round2(f.subtotal * EMPRESA.iva); f.total = round2(f.subtotal + f.iva); f.costo = round2(t.costo); if (f.estado === 'pagada') f.pagado = f.total; });
    const facPorId = {}; db.facturas.forEach(f => facPorId[f.id] = f); db.pagos.forEach(p => { const f = facPorId[p.factura]; if (f) p.monto = f.total; });
  })();
  function idx0(sid) { return SUCURSALES.find(s => s.id === sid); }
  // cotizaciones y pedidos (últimos 75 días)
  for (let k = 0; k < 130; k++) {
    const d = addDays(HOY, -irand(0, 75)); const s = pick(SUCURSALES); const c = clienteAleatorio(s, iso(d)); const nl = irand(1, 5); let sub = 0; const lineas = [];
    for (let j = 0; j < nl; j++) { const p = pick(db.productos); const cant = p.costo < 60 ? irand(20, 300) : irand(2, 30); const precio = round2(p.precio * indiceCosto(d)); lineas.push({ producto: p.id, cant, precio, importe: round2(cant * precio) }); sub += cant * precio; }
    const edad = diasEntre(iso(d), HOY_ISO); const estado = edad > 30 ? pick(['ganada', 'ganada', 'perdida', 'vencida']) : (edad > 10 ? pick(['abierta', 'ganada', 'perdida', 'abierta']) : 'abierta');
    db.cotizaciones.push({ id: 'C' + (folioCot++), fecha: iso(d), sucursal: s.id, cliente: c.id, vendedor: c.vendedor, lineas, subtotal: round2(sub), total: round2(sub * 1.16), estado, vigencia: iso(addDays(d, 15)) });
  }
  for (let k = 0; k < 64; k++) {
    const d = addDays(HOY, -irand(0, 40)); const s = pick(SUCURSALES); const c = clienteAleatorio(s, iso(d)); const nl = irand(1, 5); let sub = 0; const lineas = [];
    for (let j = 0; j < nl; j++) { const p = pick(db.productos); const cant = p.costo < 60 ? irand(20, 300) : irand(2, 30); const precio = round2(p.precio * indiceCosto(d)); lineas.push({ producto: p.id, cant, precio, importe: round2(cant * precio), surtido: 0 }); sub += cant * precio; }
    const edad = diasEntre(iso(d), HOY_ISO); const estado = edad > 12 ? pick(['facturado', 'facturado', 'surtido']) : (edad > 4 ? pick(['por surtir', 'parcial', 'surtido']) : pick(['por surtir', 'por surtir', 'parcial']));
    lineas.forEach(l => { l.surtido = estado === 'por surtir' ? 0 : (estado === 'parcial' ? Math.floor(l.cant * between(0.2, 0.8)) : l.cant); });
    db.pedidos.push({ id: 'PE' + (folioPed++), fecha: iso(d), sucursal: s.id, cliente: c.id, vendedor: c.vendedor, lineas, subtotal: round2(sub), total: round2(sub * 1.16), estado, entrega: iso(addDays(d, irand(2, 7))) });
  }
  // compras: órdenes por proveedor (≈1.3 al mes) → factura de proveedor; 14 duplicadas en jul–sep 2026
  db.proveedores.forEach((v) => {
    const prods = db.productos.filter(p => p.proveedor === v.id); if (!prods.length) return;
    for (let d = addDays(INICIO, irand(0, 20)); d <= HOY; d = addDays(d, irand(16, 32))) {
      const s = pick(SUCURSALES); const nl = Math.min(prods.length, irand(2, 6)); let sub = 0; const lineas = []; const usados = new Set();
      for (let j = 0; j < nl; j++) { const p = pick(prods); if (usados.has(p.id)) continue; usados.add(p.id); const cant = p.costo < 60 ? irand(200, 2000) : (p.costo < 500 ? irand(40, 300) : irand(6, 60)); let costo = p.costo * indiceCosto(d) * v.factor; if (v.aumento && iso(d) >= v.aumento.desde) costo *= 1 + v.aumento.pct; costo = round2(costo); lineas.push({ producto: p.id, cant, costo, importe: round2(cant * costo) }); sub += cant * costo; }
      const fecha = iso(d); const recibida = iso(addDays(d, irand(2, 9))); const edad = diasEntre(fecha, HOY_ISO);
      const oc = { id: 'OC' + (folioOC++), fecha, proveedor: v.id, sucursal: s.id, lineas, subtotal: round2(sub), iva: round2(sub * .16), total: round2(sub * 1.16), estado: edad < 3 ? 'por autorizar' : (edad < 9 ? 'autorizada' : 'recibida'), recibida: edad < 9 ? null : recibida };
      db.ordenes.push(oc);
      if (oc.estado === 'recibida') {
        const fv = { id: 'FP' + oc.id.slice(2), oc: oc.id, folioProv: v.nombre.slice(0, 2).toUpperCase() + '-' + irand(10000, 99999), proveedor: v.id, sucursal: s.id, fecha: recibida, vence: iso(addDays(parse(recibida), v.credito)), subtotal: oc.subtotal, iva: oc.iva, total: oc.total, estado: 'por pagar', fechaPago: null, duplicada: false };
        if (fv.vence < HOY_ISO && (R() < .9 || diasEntre(fv.vence, HOY_ISO) > 45)) { fv.estado = 'pagada'; fv.fechaPago = iso(addDays(parse(fv.vence), irand(-3, 6))); if (fv.fechaPago > HOY_ISO) fv.fechaPago = HOY_ISO; db.pagosProv.push({ id: 'PP' + fv.id.slice(2), facturaProv: fv.id, proveedor: v.id, fecha: fv.fechaPago, monto: fv.total, banco: 'b' + irand(1, 3) }); }
        else if (fv.vence < HOY_ISO) fv.estado = 'vencida';
        db.facturasProv.push(fv);
      }
    }
  });
  // facturas de servicios (una o dos al mes por proveedor y sucursal grande)
  db.proveedores.filter(v => v.linea === null).forEach((v) => { for (let d = addDays(INICIO, irand(0, 25)); d <= HOY; d = addDays(d, irand(9, 22))) { const s = pick(SUCURSALES); const sub = round2(between(v.rango[0], v.rango[1])); const fecha = iso(d); const fv = { id: 'FS' + (folioOC++), oc: null, folioProv: v.nombre.slice(0, 2).toUpperCase() + '-' + irand(1000, 9999), proveedor: v.id, sucursal: s.id, fecha, concepto: v.rubro + ' · ' + s.nombre, vence: iso(addDays(d, v.credito)), subtotal: sub, iva: round2(sub * .16), total: round2(sub * 1.16), estado: 'por pagar', fechaPago: null, duplicada: false }; if (fv.vence < HOY_ISO && (R() < .92 || diasEntre(fv.vence, HOY_ISO) > 45)) { fv.estado = 'pagada'; fv.fechaPago = iso(addDays(parse(fv.vence), irand(-3, 6))); if (fv.fechaPago > HOY_ISO) fv.fechaPago = HOY_ISO; db.pagosProv.push({ id: 'PP' + fv.id.slice(2), facturaProv: fv.id, proveedor: v.id, fecha: fv.fechaPago, monto: fv.total, banco: 'b3' }); } else if (fv.vence < HOY_ISO) fv.estado = 'vencida'; db.facturasProv.push(fv); } });
  // 14 facturas de servicios de jul–sep 2026 capturadas dos veces (mismo folio y monto), 3 proveedores
  (function () { const cands = db.facturasProv.filter(f => f.oc === null && f.fecha >= '2026-06-01'); const provs = [...new Set(cands.map(f => f.proveedor))].slice(0, 4); let n = 0; for (const f of cands) { if (!provs.includes(f.proveedor) || n >= 14) continue; const dup = Object.assign({}, f, { id: f.id + 'D', fecha: iso(addDays(parse(f.fecha), irand(1, 6))), duplicada: true, estado: R() < .5 ? 'pagada' : 'por pagar', fechaPago: null }); if (dup.estado === 'pagada') { dup.fechaPago = iso(addDays(parse(dup.vence), irand(-2, 3))); if (dup.fechaPago > HOY_ISO) dup.fechaPago = HOY_ISO; db.pagosProv.push({ id: 'PP' + dup.id.slice(2), facturaProv: dup.id, proveedor: dup.proveedor, fecha: dup.fechaPago, monto: dup.total, banco: 'b3' }); } db.facturasProv.push(dup); n++; } })();
  db.facturasProv.sort((a, b) => a.fecha < b.fecha ? -1 : 1);
  // existencias: días de inventario reales contra la venta de los últimos 90 días; dos productos con ~140 días
  (function () { const desde = iso(addDays(HOY, -90)); const venta = {}; db.lineasVenta.forEach(l => { if (l.fecha >= desde) { const k = l.producto + '|' + l.sucursal; venta[k] = (venta[k] || 0) + l.cant; } }); const muertos = ['p401', 'p112']; // Pintura vinílica blanca 19 L (Sur) y Escalera de tijera (Centro)
    db.productos.forEach(p => SUCURSALES.forEach(s => { const diaria = (venta[p.id + '|' + s.id] || 0) / 90; let dias = between(18, 55); if ((p.id === muertos[0] && s.id === 's3') || (p.id === muertos[1] && s.id === 's2')) dias = between(136, 146); if (R() < .07) dias = between(2, 9); const plantado = (p.id === muertos[0] && s.id === 's3') || (p.id === muertos[1] && s.id === 's2'); const exist = plantado && diaria === 0 ? 36 : Math.max(0, Math.round(diaria * dias + (diaria === 0 ? irand(0, 6) : 0))); db.existencias.push({ producto: p.id, sucursal: s.id, existencia: exist, minimo: Math.max(2, Math.round(diaria * 12)), ventaDiaria: round2(diaria), dias: diaria > 0 ? Math.round(exist / diaria) : null, ubicacion: pick(['A', 'B', 'C', 'D']) + '-' + irand(1, 24) + '-' + irand(1, 6) }); })); })();
  // bancos y movimientos (últimos 60 días)
  db.bancos = [{ id: 'b1', nombre: 'BBVA · cuenta eje', cuenta: '•••• 4471', saldo: 6842310.55 }, { id: 'b2', nombre: 'Banorte · nómina', cuenta: '•••• 0982', saldo: 1210440.10 }, { id: 'b3', nombre: 'Santander · proveedores', cuenta: '•••• 7735', saldo: 2385120.90 }];
  (function () { const desde = iso(addDays(HOY, -60)); db.pagos.filter(p => p.fecha >= desde).forEach(p => db.movBanco.push({ fecha: p.fecha, banco: p.banco, tipo: 'cobro', concepto: 'Cobro ' + p.factura, monto: p.monto, ref: p.factura })); db.pagosProv.filter(p => p.fecha >= desde).forEach(p => db.movBanco.push({ fecha: p.fecha, banco: p.banco, tipo: 'pago', concepto: 'Pago ' + p.facturaProv, monto: -p.monto, ref: p.facturaProv })); for (let d = addDays(HOY, -60); d <= HOY; d = addDays(d, 15)) db.movBanco.push({ fecha: iso(d), banco: 'b2', tipo: 'nomina', concepto: 'Nómina quincenal', monto: -db.personal.reduce((a, e) => a + e.sueldo, 0) / 2, ref: 'NOM' }); db.movBanco.sort((a, b) => a.fecha < b.fecha ? 1 : (a.fecha > b.fecha ? -1 : 0)); })();
  // definiciones del negocio (las mismas que Power BI)
  db.definiciones = [
    { id: 'venta_neta', nombre: 'Venta neta', formula: 'Suma de subtotal de facturas (sin IVA), descuentos ya aplicados; excluye cotizaciones y pedidos no facturados.', fuente: 'ERP · facturas' },
    { id: 'margen', nombre: 'Margen bruto', formula: 'Venta neta − costo de lo vendido (costo de reposición al día de la venta). % = margen / venta neta.', fuente: 'ERP · líneas de factura' },
    { id: 'precio_prom', nombre: 'Precio promedio', formula: 'Importe de líneas / unidades vendidas, por producto y sucursal.', fuente: 'ERP · líneas de factura' },
    { id: 'cartera', nombre: 'Cartera vencida', formula: 'Saldo de facturas con fecha de vencimiento anterior a hoy, por antigüedad: 1–30, 31–60, 61–90 y más de 90 días.', fuente: 'ERP · facturas y pagos' },
    { id: 'dias_inv', nombre: 'Días de inventario', formula: 'Existencia / venta diaria promedio de los últimos 90 días, por producto y sucursal. Sin venta en 90 días = sin rotación.', fuente: 'ERP · existencias y líneas' },
    { id: 'cliente_inactivo', nombre: 'Cliente inactivo', formula: 'Cliente con compras en los 12 meses previos y sin factura en los últimos 60 días.', fuente: 'ERP · facturas' },
    { id: 'dup', nombre: 'Factura de proveedor duplicada', formula: 'Dos facturas del mismo proveedor con el mismo folio del proveedor y el mismo total.', fuente: 'ERP · facturas de proveedor' }
  ];
  db.bitacora = [
    { fecha: '2026-09-17 18:42', usuario: 'Dirección', pregunta: '¿Cómo va septiembre contra agosto?', tablas: 'facturas, líneas', costo: 0.42, ms: 3800 },
    { fecha: '2026-09-17 18:44', usuario: 'Dirección', pregunta: '¿Qué clientes de Oriente dejaron de comprar?', tablas: 'facturas, clientes', costo: 0.38, ms: 3100 },
    { fecha: '2026-09-16 09:10', usuario: 'Compras', pregunta: 'Revisa las facturas de proveedor del trimestre', tablas: 'facturas de proveedor, pagos', costo: 0.71, ms: 6900 },
    { fecha: '2026-09-15 08:55', usuario: 'Dirección', pregunta: 'Prepara el mensaje para el vendedor de Oriente', tablas: 'clientes, facturas', costo: 0.55, ms: 5200 },
    { fecha: '2026-09-12 17:20', usuario: 'Finanzas', pregunta: '¿Cuánto vence esta semana en cuentas por pagar?', tablas: 'facturas de proveedor', costo: 0.29, ms: 2400 }
  ];
  db.encargos = [
    { id: 'k1', fecha: '2026-09-15', texto: 'Preparar mensaje para el vendedor de Oriente por los tres clientes grandes sin compras desde julio', estado: 'hecho', tipo: 'mensaje', seguimiento: 'Borrador enviado a dirección el 15-sep' },
    { id: 'k2', fecha: '2026-09-16', texto: 'Revisar con Compras las 14 facturas de proveedor duplicadas del trimestre', estado: 'en curso', tipo: 'revisión', seguimiento: 'Compras confirmó 9; faltan 5 por revisar' },
    { id: 'k3', fecha: '2026-09-16', texto: 'Vigilar los productos con más de 120 días de inventario y avisar si cambian', estado: 'vigilando', tipo: 'vigilancia', seguimiento: 'Sin cambios desde el 16-sep' }
  ];

  // ---------- almacenamiento de cambios del usuario ----------
  const KEY = 'erp_demo_v1';
  let cambios = { nuevos: { facturas: [], lineasVenta: [], pagos: [], cotizaciones: [], pedidos: [], ordenes: [], facturasProv: [], pagosProv: [], encargos: [], bitacora: [], movBanco: [] }, estados: {}, ajustes: [], chat: [], prefs: {} };
  try { const raw = localStorage.getItem(KEY); if (raw) cambios = Object.assign(cambios, JSON.parse(raw)); } catch (e) { }
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(cambios)); } catch (e) { } }
  function aplicarCambios() {
    Object.keys(cambios.nuevos).forEach(t => { (cambios.nuevos[t] || []).forEach(r => { if (!db[t].find(x => x.id === r.id)) db[t].push(r); }); });
    Object.keys(cambios.estados).forEach(k => { const [t, id] = k.split(':'); const r = (db[t] || []).find(x => x.id === id); if (r) Object.assign(r, cambios.estados[k]); });
    (cambios.ajustes || []).forEach(a => { const e = db.existencias.find(x => x.producto === a.producto && x.sucursal === a.sucursal); if (e) e.existencia = Math.max(0, e.existencia + a.delta); });
  }
  aplicarCambios();
  const bus = new BroadcastChannel('erp_demo');
  function agregar(tabla, reg) { db[tabla].push(reg); cambios.nuevos[tabla] = cambios.nuevos[tabla] || []; cambios.nuevos[tabla].push(reg); guardar(); bus.postMessage({ t: 'cambio' }); return reg; }
  function actualizar(tabla, id, campos) { const r = db[tabla].find(x => x.id === id); if (!r) return null; Object.assign(r, campos); const k = tabla + ':' + id; cambios.estados[k] = Object.assign(cambios.estados[k] || {}, campos); guardar(); bus.postMessage({ t: 'cambio' }); return r; }
  function ajustarExistencia(producto, sucursal, delta, motivo) { const e = db.existencias.find(x => x.producto === producto && x.sucursal === sucursal); if (!e) return; e.existencia = Math.max(0, e.existencia + delta); cambios.ajustes.push({ producto, sucursal, delta, motivo, fecha: HOY_ISO }); guardar(); bus.postMessage({ t: 'cambio' }); }
  function reiniciar() { try { localStorage.removeItem(KEY); } catch (e) { } location.reload(); }
  const siguienteFolio = (tabla, prefijo) => prefijo + (Math.max(0, ...db[tabla].map(r => parseInt(String(r.id).replace(/\D/g, ''), 10) || 0)) + 1);

  // ---------- índices y utilidades ----------
  const idx = { prod: {}, cli: {}, prov: {}, vend: {}, suc: {}, lin: {} };
  db.productos.forEach(p => idx.prod[p.id] = p); db.clientes.forEach(c => idx.cli[c.id] = c); db.proveedores.forEach(v => idx.prov[v.id] = v); db.vendedores.forEach(v => idx.vend[v.id] = v); SUCURSALES.forEach(s => idx.suc[s.id] = s); LINEAS.forEach(l => idx.lin[l.id] = l);
  const nombreDe = { prod: id => (idx.prod[id] || {}).nombre || id, cli: id => (idx.cli[id] || {}).nombre || id, prov: id => (idx.prov[id] || {}).nombre || id, vend: id => (idx.vend[id] || {}).nombre || id, suc: id => (idx.suc[id] || {}).nombre || id, lin: id => id === null ? 'Servicios y gastos' : ((idx.lin[id] || {}).nombre || id) };
  const fmt = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 });
  const fmt0 = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
  const num = new Intl.NumberFormat('es-MX');
  const money = (n) => fmt.format(n || 0), money0 = (n) => fmt0.format(n || 0);
  const corto = (n) => { const a = Math.abs(n || 0); if (a >= 1e6) return (n < 0 ? '−' : '') + '$' + (a / 1e6).toLocaleString('es-MX', { maximumFractionDigits: a >= 1e8 ? 0 : 1 }) + ' M'; if (a >= 1e3) return (n < 0 ? '−' : '') + '$' + (a / 1e3).toLocaleString('es-MX', { maximumFractionDigits: a >= 1e5 ? 0 : 1 }) + ' k'; return money0(n); };
  const pct = (x, d = 1) => (x == null || !isFinite(x) ? '—' : (x * 100).toLocaleString('es-MX', { maximumFractionDigits: d, minimumFractionDigits: d }) + '%');
  const fechaLarga = (s) => { if (!s) return '—'; const d = parse(s); return d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear(); };
  const fechaCorta = (s) => { if (!s) return '—'; const d = parse(s); return d.getDate() + ' ' + MESES_CORTO[d.getMonth()] + (d.getFullYear() !== HOY.getFullYear() ? ' ' + String(d.getFullYear()).slice(2) : ''); };
  const mesLabel = (ym, largo) => { const [y, m] = ym.split('-').map(Number); return (largo ? MESES[m - 1] : MESES_CORTO[m - 1]) + ' ' + (largo ? y : String(y).slice(2)); };
  const mesActual = ymDe(HOY_ISO); const mesAnterior = (ym, n = 1) => { const [y, m] = ym.split('-').map(Number); const d = new Date(y, m - 1 - n, 1); return d.getFullYear() + '-' + pad(d.getMonth() + 1); };
  const rangoMes = (ym) => { const [y, m] = ym.split('-').map(Number); const fin = new Date(y, m, 0); return [ym + '-01', iso(fin)]; };

  // ---------- análisis (los números los saca el código; la IA solo los explica) ----------
  function filtrarLineas(f = {}) { return db.lineasVenta.filter(l => (!f.desde || l.fecha >= f.desde) && (!f.hasta || l.fecha <= f.hasta) && (!f.sucursal || l.sucursal === f.sucursal) && (!f.linea || l.linea === f.linea) && (!f.producto || l.producto === f.producto) && (!f.cliente || l.cliente === f.cliente) && (!f.vendedor || l.vendedor === f.vendedor)); }
  function filtrarFacturas(f = {}) { return db.facturas.filter(x => (!f.desde || x.fecha >= f.desde) && (!f.hasta || x.fecha <= f.hasta) && (!f.sucursal || x.sucursal === f.sucursal) && (!f.cliente || x.cliente === f.cliente) && (!f.vendedor || x.vendedor === f.vendedor) && (!f.estado || x.estado === f.estado)); }
  function resumen(lineas) { let venta = 0, costo = 0, unidades = 0; const facs = new Set(); lineas.forEach(l => { venta += l.importe; costo += l.costo; unidades += l.cant; facs.add(l.factura); }); return { venta: round2(venta), costo: round2(costo), margen: round2(venta - costo), margenPct: venta ? (venta - costo) / venta : null, unidades, facturas: facs.size, ticket: facs.size ? round2(venta / facs.size) : 0 }; }
  function porMes(f = {}) { const m = {}; filtrarLineas(f).forEach(l => { const k = ymDe(l.fecha); (m[k] = m[k] || []).push(l); }); return Object.keys(m).sort().map(k => Object.assign({ mes: k }, resumen(m[k]))); }
  function por(dim, f = {}) { const key = { sucursal: 'sucursal', linea: 'linea', producto: 'producto', cliente: 'cliente', vendedor: 'vendedor' }[dim]; const m = {}; filtrarLineas(f).forEach(l => { (m[l[key]] = m[l[key]] || []).push(l); }); const nom = { sucursal: nombreDe.suc, linea: nombreDe.lin, producto: nombreDe.prod, cliente: nombreDe.cli, vendedor: nombreDe.vend }[dim]; return Object.keys(m).map(k => Object.assign({ id: k, nombre: nom(k) }, resumen(m[k]))).sort((a, b) => b.venta - a.venta); }
  function comparativo(ym, f = {}) { const [d1, h1] = rangoMes(ym); const [d2, h2] = rangoMes(mesAnterior(ym, 12)); const [d3, h3] = rangoMes(mesAnterior(ym, 1)); const a = resumen(filtrarLineas(Object.assign({}, f, { desde: d1, hasta: h1 }))), b = resumen(filtrarLineas(Object.assign({}, f, { desde: d2, hasta: h2 }))), c = resumen(filtrarLineas(Object.assign({}, f, { desde: d3, hasta: h3 }))); return { mes: ym, actual: a, anioAnterior: b, mesAnterior: c, varAnual: b.venta ? a.venta / b.venta - 1 : null, varMensual: c.venta ? a.venta / c.venta - 1 : null }; }
  function precioPromedio(f = {}) { const m = {}; filtrarLineas(f).forEach(l => { const k = ymDe(l.fecha); m[k] = m[k] || { imp: 0, cant: 0, base: 0 }; m[k].imp += l.importe; m[k].cant += l.cant; m[k].base += l.cant * (idx.prod[l.producto] || {}).precio * indiceCosto(parse(l.fecha)); }); return Object.keys(m).sort().map(k => ({ mes: k, indice: m[k].base ? m[k].imp / m[k].base : null })); }
  function cartera(f = {}) { const hoy = HOY_ISO; const abiertas = filtrarFacturas(f).filter(x => x.estado !== 'pagada'); const tramos = { '1-30': 0, '31-60': 0, '61-90': 0, '>90': 0, 'por vencer': 0 }; abiertas.forEach(x => { const saldo = x.total - (x.pagado || 0); if (x.vence >= hoy) tramos['por vencer'] += saldo; else { const d = diasEntre(x.vence, hoy); tramos[d <= 30 ? '1-30' : d <= 60 ? '31-60' : d <= 90 ? '61-90' : '>90'] += saldo; } }); const vencidas = abiertas.filter(x => x.vence < hoy).map(x => Object.assign({ dias: diasEntre(x.vence, hoy), saldo: round2(x.total - (x.pagado || 0)) }, x)).sort((a, b) => b.dias - a.dias); const porCliente = {}; vencidas.forEach(x => { porCliente[x.cliente] = porCliente[x.cliente] || { cliente: x.cliente, nombre: nombreDe.cli(x.cliente), saldo: 0, facturas: 0, maxDias: 0, vendedor: x.vendedor, sucursal: x.sucursal }; porCliente[x.cliente].saldo += x.saldo; porCliente[x.cliente].facturas++; porCliente[x.cliente].maxDias = Math.max(porCliente[x.cliente].maxDias, x.dias); }); return { tramos, vencidas, totalVencido: round2(vencidas.reduce((a, x) => a + x.saldo, 0)), porVencer: round2(tramos['por vencer']), porCliente: Object.values(porCliente).sort((a, b) => b.saldo - a.saldo) }; }
  function clientesInactivos(dias = 60) { const corte = iso(addDays(HOY, -dias)), hace12 = iso(addDays(HOY, -365 - dias)); const ult = {}, compra12 = {}; db.facturas.forEach(x => { if (!ult[x.cliente] || x.fecha > ult[x.cliente]) ult[x.cliente] = x.fecha; if (x.fecha >= hace12 && x.fecha < corte) compra12[x.cliente] = (compra12[x.cliente] || 0) + x.subtotal; }); return db.clientes.filter(c => ult[c.id] && ult[c.id] < corte && compra12[c.id] > 0).map(c => ({ cliente: c.id, nombre: c.nombre, sucursal: c.sucursal, vendedor: c.vendedor, tamano: c.tamano, ultima: ult[c.id], dias: diasEntre(ult[c.id], HOY_ISO), venta12: round2(compra12[c.id]) })).sort((a, b) => b.venta12 - a.venta12); }
  function duplicadasProveedor() { const m = {}; db.facturasProv.forEach(f => { const k = f.proveedor + '|' + f.folioProv + '|' + f.total; (m[k] = m[k] || []).push(f); }); return Object.values(m).filter(g => g.length > 1).map(g => ({ proveedor: g[0].proveedor, nombre: nombreDe.prov(g[0].proveedor), folioProv: g[0].folioProv, total: g[0].total, facturas: g.map(x => x.id), fechas: g.map(x => x.fecha), pagadaDosVeces: g.filter(x => x.estado === 'pagada').length > 1, estados: g.map(x => x.estado) })); }
  function aumentosProveedor(umbral = 0.08) { const desde2 = iso(addDays(HOY, -90)), desde1 = iso(addDays(HOY, -180)); const res = []; db.proveedores.forEach(v => { const l1 = [], l2 = []; db.ordenes.filter(o => o.proveedor === v.id && o.fecha >= desde1).forEach(o => o.lineas.forEach(l => (o.fecha >= desde2 ? l2 : l1).push(l))); const idxDe = (ls) => { let imp = 0, base = 0; ls.forEach(l => { imp += l.importe; base += l.cant * idx.prod[l.producto].costo; }); return base ? imp / base : null; }; const a = idxDe(l1), b = idxDe(l2); if (a && b && b / a - 1 >= umbral) res.push({ proveedor: v.id, nombre: v.nombre, linea: nombreDe.lin(v.linea), variacion: b / a - 1, compras90: round2(l2.reduce((s, l) => s + l.importe, 0)) }); }); return res.sort((x, y) => y.variacion - x.variacion); }
  function inventarioMuerto(dias = 120) { return db.existencias.filter(e => e.existencia > 0 && (e.dias === null || e.dias >= dias)).map(e => Object.assign({ nombre: nombreDe.prod(e.producto), sucursalNombre: nombreDe.suc(e.sucursal), valor: round2(e.existencia * idx.prod[e.producto].costo) }, e)).sort((a, b) => b.valor - a.valor); }
  function bajoMinimo() { return db.existencias.filter(e => e.existencia <= e.minimo && e.ventaDiaria > 0).map(e => Object.assign({ nombre: nombreDe.prod(e.producto), sucursalNombre: nombreDe.suc(e.sucursal) }, e)).sort((a, b) => (a.dias || 0) - (b.dias || 0)); }
  function margenNegativo(f = {}) { const desde = f.desde || iso(addDays(HOY, -90)); const m = {}; filtrarLineas(Object.assign({}, f, { desde })).forEach(l => { const k = l.producto + '|' + l.sucursal; m[k] = m[k] || { producto: l.producto, sucursal: l.sucursal, venta: 0, costo: 0, cant: 0 }; m[k].venta += l.importe; m[k].costo += l.costo; m[k].cant += l.cant; }); return Object.values(m).filter(x => x.venta < x.costo).map(x => Object.assign({ nombre: nombreDe.prod(x.producto), sucursalNombre: nombreDe.suc(x.sucursal), perdida: round2(x.costo - x.venta), margenPct: (x.venta - x.costo) / x.venta }, x)).sort((a, b) => b.perdida - a.perdida); }
  function cuentasPorPagar() { const hoy = HOY_ISO; const abiertas = db.facturasProv.filter(f => f.estado !== 'pagada'); const prox = abiertas.filter(f => f.vence >= hoy && f.vence <= iso(addDays(HOY, 15))); const venc = abiertas.filter(f => f.vence < hoy); return { total: round2(abiertas.reduce((a, f) => a + f.total, 0)), proximas15: round2(prox.reduce((a, f) => a + f.total, 0)), vencidas: round2(venc.reduce((a, f) => a + f.total, 0)), lista: abiertas.sort((a, b) => a.vence < b.vence ? -1 : 1) }; }
  function comprasPorMes(f = {}) { const m = {}; db.ordenes.filter(o => o.estado === 'recibida' && (!f.proveedor || o.proveedor === f.proveedor) && (!f.sucursal || o.sucursal === f.sucursal)).forEach(o => { const k = ymDe(o.fecha); m[k] = (m[k] || 0) + o.subtotal; }); return Object.keys(m).sort().map(k => ({ mes: k, compras: round2(m[k]) })); }
  function comprasPorProveedor(f = {}) { const m = {}; db.ordenes.filter(o => o.estado === 'recibida' && (!f.desde || o.fecha >= f.desde) && (!f.hasta || o.fecha <= f.hasta)).forEach(o => { m[o.proveedor] = (m[o.proveedor] || 0) + o.subtotal; }); return Object.keys(m).map(k => ({ id: k, nombre: nombreDe.prov(k), linea: nombreDe.lin(idx.prov[k].linea), compras: round2(m[k]) })).sort((a, b) => b.compras - a.compras); }
  function pipeline() { const abiertas = db.cotizaciones.filter(c => c.estado === 'abierta'); const ganadas = db.cotizaciones.filter(c => c.estado === 'ganada'), perdidas = db.cotizaciones.filter(c => c.estado === 'perdida'); return { abiertas: abiertas.length, montoAbierto: round2(abiertas.reduce((a, c) => a + c.subtotal, 0)), cierre: (ganadas.length + perdidas.length) ? ganadas.length / (ganadas.length + perdidas.length) : null, pedidosPorSurtir: db.pedidos.filter(p => p.estado === 'por surtir' || p.estado === 'parcial').length }; }
  function hallazgos() { // lo que el asistente encuentra sin que se lo pidan
    const out = []; const dup = duplicadasProveedor(); if (dup.length) out.push({ tipo: 'dup', nivel: 'alto', titulo: dup.length + ' facturas de proveedor duplicadas', detalle: corto(dup.reduce((a, d) => a + d.total, 0)) + ' en ' + [...new Set(dup.map(d => d.nombre))].length + ' proveedores; ' + dup.filter(d => d.pagadaDosVeces).length + ' ya se pagaron dos veces.', accion: 'Ver duplicadas', vista: 'compras-facturas', filtro: 'duplicadas' });
    const inac = clientesInactivos(60).filter(c => c.tamano !== 'chico'); if (inac.length) out.push({ tipo: 'inactivos', nivel: 'alto', titulo: inac.length + ' clientes grandes o medianos sin comprar', detalle: 'Compraban ' + corto(inac.reduce((a, c) => a + c.venta12, 0)) + ' al año; el más grande lleva ' + inac[0].dias + ' días sin factura (' + nombreDe.suc(inac[0].sucursal) + ').', accion: 'Ver clientes', vista: 'ventas-clientes', filtro: 'inactivos' });
    const aum = aumentosProveedor(); if (aum.length) out.push({ tipo: 'aumento', nivel: 'medio', titulo: nombreDe.prov(aum[0].proveedor) + ' subió ' + pct(aum[0].variacion, 0), detalle: 'Sin renegociación registrada; compras del trimestre ' + corto(aum[0].compras90) + '.', accion: 'Ver proveedor', vista: 'compras-proveedores', filtro: aum[0].proveedor });
    const muerto = inventarioMuerto(120); if (muerto.length) out.push({ tipo: 'muerto', nivel: 'medio', titulo: muerto.length + ' productos con más de 120 días de inventario', detalle: corto(muerto.reduce((a, m) => a + m.valor, 0)) + ' parados; el peor: ' + muerto[0].nombre + ' en ' + muerto[0].sucursalNombre + ' (' + (muerto[0].dias === null ? 'sin venta' : muerto[0].dias + ' días') + ').', accion: 'Ver inventario', vista: 'inventario-existencias', filtro: 'muerto' });
    const neg = margenNegativo(); if (neg.length) out.push({ tipo: 'margen', nivel: 'alto', titulo: neg.length + ' productos vendidos por debajo del costo', detalle: neg[0].nombre + ' en ' + neg[0].sucursalNombre + ': ' + pct(neg[0].margenPct) + ' de margen; pérdida acumulada ' + corto(neg.reduce((a, n) => a + n.perdida, 0)) + ' en 90 días.', accion: 'Ver productos', vista: 'inventario-productos', filtro: 'margen' });
    const car = cartera(); const viejo = car.tramos['>90']; if (viejo > 0) out.push({ tipo: 'cartera', nivel: 'medio', titulo: corto(viejo) + ' vencidos a más de 90 días', detalle: car.porCliente.length + ' clientes con saldo vencido; total vencido ' + corto(car.totalVencido) + '.', accion: 'Ver cobranza', vista: 'finanzas-cobranza', filtro: '>90' });
    const bajo = bajoMinimo(); if (bajo.length) out.push({ tipo: 'minimo', nivel: 'bajo', titulo: bajo.length + ' productos bajo mínimo', detalle: bajo.slice(0, 2).map(b => b.nombre + ' (' + b.sucursalNombre + ')').join(', ') + '.', accion: 'Ver existencias', vista: 'inventario-existencias', filtro: 'minimo' });
    return out;
  }
  function buscar(q) { q = (q || '').trim().toLowerCase(); if (q.length < 2) return []; const out = []; const add = (tipo, id, titulo, sub, vista) => out.push({ tipo, id, titulo, sub, vista }); db.clientes.forEach(c => { if (c.nombre.toLowerCase().includes(q) || c.rfc.toLowerCase().includes(q)) add('Cliente', c.id, c.nombre, nombreDe.suc(c.sucursal) + ' · ' + c.tamano, 'ventas-clientes'); }); db.productos.forEach(p => { if (p.nombre.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) add('Producto', p.id, p.nombre, p.sku + ' · ' + nombreDe.lin(p.linea), 'inventario-productos'); }); db.proveedores.forEach(v => { if (v.nombre.toLowerCase().includes(q)) add('Proveedor', v.id, v.nombre, nombreDe.lin(v.linea), 'compras-proveedores'); }); db.vendedores.forEach(v => { if (v.nombre.toLowerCase().includes(q)) add('Vendedor', v.id, v.nombre, nombreDe.suc(v.sucursal), 'ventas-vendedores'); }); if (/^f\d+/i.test(q)) db.facturas.filter(f => f.id.toLowerCase().startsWith(q)).slice(0, 5).forEach(f => add('Factura', f.id, f.id + ' · ' + nombreDe.cli(f.cliente), money(f.total) + ' · ' + f.estado, 'ventas-facturas')); if (/^(oc|fp|pe|c)\d+/i.test(q)) { db.ordenes.filter(o => o.id.toLowerCase().startsWith(q)).slice(0, 5).forEach(o => add('Orden de compra', o.id, o.id + ' · ' + nombreDe.prov(o.proveedor), money(o.total) + ' · ' + o.estado, 'compras-ordenes')); db.pedidos.filter(o => o.id.toLowerCase().startsWith(q)).slice(0, 5).forEach(o => add('Pedido', o.id, o.id + ' · ' + nombreDe.cli(o.cliente), money(o.total) + ' · ' + o.estado, 'ventas-pedidos')); } return out.slice(0, 12); }

  window.ERP = { db, HOY, HOY_ISO, INICIO, MESES, MESES_CORTO, idx, nombreDe, money, money0, corto, pct, num, fechaLarga, fechaCorta, mesLabel, mesActual, mesAnterior, rangoMes, iso, parse, addDays, diasEntre, ymDe, round2, pad, agregar, actualizar, ajustarExistencia, reiniciar, guardar, cambios, bus, siguienteFolio,
    M: { filtrarLineas, filtrarFacturas, resumen, porMes, por, comparativo, precioPromedio, cartera, clientesInactivos, duplicadasProveedor, aumentosProveedor, inventarioMuerto, bajoMinimo, margenNegativo, cuentasPorPagar, comprasPorMes, comprasPorProveedor, pipeline, hallazgos, buscar } };
})();
