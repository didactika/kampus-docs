---
title: Cuentas
description: Invitar a personas, el ciclo de vida de una cuenta, el borrado con periodo de gracia y las cuentas de servicio.
sidebar:
  order: 2
---

Disponible desde 0.1.0.

Una cuenta pertenece a un campus. Su nombre de usuario y su correo son únicos en el campus, y las mayúsculas no cuentan: `Ana@Example.org` y `ana@example.org` son la misma cuenta.

## Estados

| Estado | Significado |
| --- | --- |
| Invitada | Un gestor invitó a la persona; el enlace de invitación le permite elegir su contraseña |
| Pendiente de confirmación | La persona se registró; el enlace enviado a su correo confirma la cuenta |
| Activa | La persona puede iniciar sesión |
| Suspendida | La persona no puede iniciar sesión; todas sus sesiones y tokens de API terminaron a la vez |
| Borrada | Sus datos personales se borraron; solo queda un seudónimo, para que los registros sigan apuntando a ella |

Cada cambio de estado guarda quién lo hizo, cuándo y por qué. No puedes cambiar el estado de tu propia cuenta.

## Invitar a personas

Con `identity.account.invite` invitas a una persona por correo y, si quieres, con un nombre de usuario (si no, se usa el correo). Recibe un enlace válido 7 días para elegir su contraseña; el enlace funciona una sola vez. Kampus nunca crea, envía ni muestra una contraseña.

Cuando el campus permite el registro libre, los visitantes pueden crear su propia cuenta; la confirman con el enlace enviado a su correo, válido 24 horas.

## Suspender y reactivar

Con `identity.account.suspend` suspendes una cuenta indicando un motivo, y la reactivas después. Mientras está suspendida, la persona no puede iniciar sesión y pierde todos sus permisos. Si dos administradores cambian la misma cuenta a la vez, el segundo cambio se rechaza en lugar de sobrescribir el primero.

## Borrar

Con `identity.account.delete` programas un borrado. La cuenta se suspende en el acto y se borra al terminar el periodo de gracia (14 días por defecto). Hasta entonces puedes cancelar el borrado, y reactivar la cuenta también lo cancela.

Cuando se ejecuta el borrado, se eliminan los datos personales de la cuenta: correo, nombre de usuario, contraseña, segundos factores, sesiones, tokens de API y el registro de inicios de sesión. La cuenta queda como lápida con un seudónimo como `deleted-3f9a1c2b7e0d`, para que las calificaciones y aportaciones conserven una referencia válida. El correo queda libre para una cuenta nueva.

## Cuentas de servicio

Una cuenta de servicio es para una integración, no para una persona. No tiene contraseña ni puede iniciar sesión: actúa solo con tokens de API y solo tiene los roles que le asignes. Se crea con `identity.account.invite`; sus tokens se crean y revocan con `identity.token.manage_any`.

## Proveedores de identidad

Con `identity.provider.manage` conectas un proveedor OpenID Connect (por ejemplo, el inicio de sesión único de tu organización) al campus: su URL de emisor, y el identificador y el secreto de cliente que te dio el proveedor. El secreto se guarda cifrado. Después, las personas eligen el proveedor en la página de inicio de sesión.

La cuenta de una persona en el proveedor se vincula una vez a su cuenta de Kampus, mediante el identificador que el propio proveedor le da, y desde entonces se usa ese vínculo. Cómo se crea el primer vínculo lo decide la **política de vinculación**:

| Política | Primer inicio de sesión con el proveedor |
| --- | --- |
| Solo identificador | No se vincula nada al iniciar sesión: solo valen los vínculos creados antes |
| Correo verificado | Vincula con la cuenta activa del mismo correo, solo si el proveedor indica que el correo está verificado |
| Confirmar | La persona lo confirma iniciando sesión con su contraseña de Kampus; entonces se crea el vínculo |

Kampus nunca vincula una cuenta solo porque coincida un correo sin verificar. Iniciar sesión con un proveedor pide el segundo factor como cualquier otro inicio de sesión, y las cuentas suspendidas tampoco pueden entrar con un proveedor.

## Permisos de identidad

| Permiso | Qué permite | Roles por defecto |
| --- | --- | --- |
| `identity.account.invite` | Invitar a personas y crear cuentas de servicio | Administradores, Gestor |
| `identity.account.suspend` | Suspender y reactivar cuentas | Administradores, Gestor |
| `identity.account.delete` | Programar y cancelar borrados | Administradores |
| `identity.account.read` | Consultar las cuentas del campus | Administradores, Gestor |
| `identity.provider.manage` | Configurar proveedores de identidad | Administradores |
| `identity.token.manage_own` | Crear y revocar los propios tokens de API | Administradores, Gestor, Usuario autenticado |
| `identity.token.manage_any` | Crear y revocar los tokens de cualquier cuenta | Administradores |

Toda persona activa tiene el rol **Usuario autenticado** en su campus.

## Política por defecto

| Ajuste | Por defecto |
| --- | --- |
| Registro libre | Desactivado |
| Contraseña más corta | 12 caracteres, sin contener el nombre de usuario ni el correo |
| Enlace de confirmación | 24 horas |
| Enlace de invitación | 7 días |
| Sesión | Termina tras 8 horas sin uso, y a los 7 días como máximo |
| Operaciones sensibles | Piden la contraseña de nuevo si el último inicio de sesión tiene más de 15 minutos |
| Tokens de API | 90 días por defecto, un año como máximo |
| Periodo de gracia del borrado | 14 días |
| Inicios de sesión fallidos | Tras 3, cada nuevo intento espera más; tras 10, el inicio de sesión se bloquea 15 minutos |
