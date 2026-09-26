# Desplegar RemodelaUSA en internet

RemodelaUSA es una aplicación **completa** (sitio + API + base de datos SQLite + fotos).
No puede publicarse como sitio estático: necesita un hosting de Node.js con disco
persistente. Esta guía usa **Render** (el más simple), con un costo aproximado de
**~$7–8 USD/mes** (servicio Starter $7 + disco de 1 GB ~$0.25).

## Opción recomendada: Render + Blueprint (15 minutos)

### 1. Subir el código a GitHub

```bash
cd app
git init
git add .
git commit -m "RemodelaUSA listo para producción"
```

Luego crea un repositorio privado en https://github.com/new (puedes llamarlo
`remodelausa`) y ejecuta los dos comandos que GitHub te muestra, por ejemplo:

```bash
git remote add origin https://github.com/TU_USUARIO/remodelausa.git
git branch -M main
git push -u origin main
```

### 2. Crear el servicio en Render

1. Entra a https://dashboard.render.com y crea cuenta (puedes usar «Sign in with GitHub»).
2. **New + → Blueprint**.
3. Conecta tu repositorio `remodelausa`. Render detecta el `render.yaml` solo.
4. En la pantalla de confirmación verás el disco `remodelausa-data` de 1 GB.
5. **Deploy**. Espera 5–10 minutos (instala dependencias y compila el sitio).

### 3. Configurar después del primer despliegue

En **Environment** del servicio:

- `PUBLIC_URL` = la URL que te dio Render (`https://remodelausa.onrender.com`)
  o tu dominio propio si lo conectas. Sirve para que los correos lleven el
  enlace correcto al portal del contratista.
- `ADMIN_TOKEN` = Render ya generó uno aleatorio; cópialo y guárdalo (es tu
  llave de entrada a `/admin`).
- `OWNER_EMAIL` = tu correo para recibir avisos de nuevos leads.

En **Settings → Custom Domains** puedes conectar `remodelausa.com`:
Render te da los registros DNS (un CNAME) que debes agregar donde compraste el dominio.

### 4. Activar producción real (cuando quieras)

- **Correos reales:** crea cuenta gratis en https://resend.com, verifica tu
  dominio y pega `RESEND_API_KEY` en Environment.
- **Cobro de comisiones:** crea cuenta en https://stripe.com, copia tu
  `STRIPE_SECRET_KEY` (modo live) y pégala en Environment.

Sin estas claves el sistema funciona igual: los correos se guardan en la
bandeja interna de `/admin` y el cobro de comisiones queda en modo demo.

## Alternativas

- **Railway** (railway.app): New Project → Deploy from GitHub; añade un
  **Volume** montado en `/var/data/remodelausa` y la variable `DATA_DIR` igual.
- **VPS barato** (Hetzner/DigitalOcean ~$5/mes): instala Node 24, clona el repo,
  `npm ci && npm run build`, `DATA_DIR=/var/data/remodelausa npm start` con
  `pm2` o `systemd`, y apunta el dominio con nginx.

## Importante

- La base de datos y las fotos viven en el **disco persistente** (`DATA_DIR`).
  No elimines el disco en Render: ahí están tus leads y cuentas.
- La primera visita puede tardar ~50 segundos si el servicio estaba dormido
  (plan Starter); Render lo mantiene activo mientras tenga tráfico.
