# Fase 7 · T7 · Prueba en las tiendas (pendiente)

Criterio de aceptación de la fase 7: compra, renovación, cancelación y restauración probadas en los entornos de prueba de ambas tiendas. Bloqueada hasta tener las cuentas. Nada de esto lo hace Claude sin tu confirmación: crear cuentas y gastar dinero es tuyo.

## 1. Cuentas (las creas tú)

1. **Apple Developer Program** (99 $/año) y **Google Play Console** (25 $ una vez), con el identificador `com.javioller.aptiq`.
2. **RevenueCat** (gratis hasta cierto volumen de ingresos). Proyecto «Aptiq».

## 2. Productos en las tiendas

| Producto | Tipo | Precio | Notas |
| --- | --- | --- | --- |
| `aptiq_mensual` | Suscripción auto-renovable | 7,99 € | Grupo «Premium» |
| `aptiq_anual` | Suscripción auto-renovable | 39,99 € | Grupo «Premium», oferta de introducción: 7 días gratis |
| `aptiq_pase_3m` | Compra no renovable (Apple) / producto único (Google) | 19,99 € | 3 meses |
| `aptiq_pase_6m` | Compra no renovable (Apple) / producto único (Google) | 29,99 € | 6 meses |

## 3. RevenueCat

1. Conectar App Store Connect y Google Play (credenciales de servidor solo en RevenueCat, nunca en la app).
2. Permiso (entitlement) `premium` con los cuatro productos.
3. Para los pases (no renovables), configurar su duración en RevenueCat para que el permiso caduque a los 3 y 6 meses.
4. Oferta `default` con paquetes Mensual, Anual, 3 meses y 6 meses (tipos predefinidos de RevenueCat).
5. Copiar las **claves públicas del SDK** (empiezan por `appl_` y `goog_`) a `apps/mobile/.env` como `EXPO_PUBLIC_REVENUECAT_IOS_KEY` y `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`, y como variables de EAS.

## 4. Pruebas (en un iPhone y un Android reales)

Con cuentas de prueba (Sandbox en Apple; testers de licencia en Google Play, pista de prueba interna):

1. **Compra:** termina el primer simulacro → muro → «Probar 7 días gratis». Cuenta muestra «Premium · Se renueva el …» y desaparecen los candados.
2. **Renovación:** en sandbox las renovaciones van aceleradas (un mes ≈ 5 minutos en Apple). Comprueba que sigue Premium y cambia la fecha.
3. **Cancelación:** «Gestionar suscripción» → cancelar en la tienda. Al caducar, vuelven los candados; lo hecho sigue visible.
4. **Pase:** compra el de 3 meses → «Activo hasta el …, no se renueva» y sin «Gestionar».
5. **Restaurar:** borra la app, instálala de nuevo, «Restaurar compras» → vuelve Premium. Con cuenta de Aptiq, entra en otro móvil → Premium sin restaurar.
6. **Errores:** modo avión en la compra → «No hay conexión»; cancelar la hoja de pago → sin mensaje.

Anota el resultado en `docs/progreso.md`.
