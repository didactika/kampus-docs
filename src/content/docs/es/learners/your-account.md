---
title: Tu cuenta
description: Registrarte, elegir tu contraseña, iniciar sesión, los segundos factores, las sesiones, recuperar el acceso y cambiar tu contraseña.
sidebar:
  order: 1
---

Disponible desde 0.1.0.

## Obtener una cuenta

Tu campus te invita o te deja registrarte con tu correo. En los dos casos recibes un enlace por correo: ábrelo y elige tu contraseña. Un enlace de invitación dura 7 días y uno de registro 24 horas; cada uno funciona una sola vez. Si un enlace caducó, pide uno nuevo.

Si te registras con un correo que ya tiene cuenta, recibes un mensaje que te lo indica en lugar de un enlace nuevo.

## Tu contraseña

Tu campus fija las reglas; por defecto una contraseña tiene al menos 12 caracteres y no puede contener tu nombre de usuario ni tu correo. Una frase larga que recuerdes es una buena contraseña. Nadie en tu campus puede verla, y Kampus nunca te la envía.

## Iniciar sesión

Inicia sesión con tu nombre de usuario o tu correo y tu contraseña. Cuando la respuesta es "inicio de sesión fallido", Kampus no dice si la cuenta existe o si la contraseña era incorrecta, a propósito. Tras unos pocos intentos fallidos tienes que esperar un poco antes de volver a intentarlo, y tras muchos el inicio de sesión se bloquea un rato.

## Sesiones

Cada navegador o aplicación con la que inicias sesión tiene su propia sesión. Una sesión termina tras 8 horas sin uso, a los 7 días como máximo, o cuando cierras sesión. Puedes ver tus sesiones abiertas y cerrar las que no reconozcas.

## Cambiar tu contraseña

Para cambiar tu contraseña necesitas la actual y, si iniciaste sesión hace más de 15 minutos, confirmarla primero. Al cambiarla terminan todas tus sesiones y tokens de API, en todos tus dispositivos, y recibes un correo que te lo avisa.

## Segundos factores

Un segundo factor protege tu cuenta aunque alguien conozca tu contraseña. Puedes añadir:

- una **aplicación de autenticación**: escanea el código QR con la aplicación y escribe el código de seis cifras que muestra;
- **códigos por correo**: al iniciar sesión, Kampus envía a tu correo un código de ocho cifras, válido 10 minutos.

Al añadir tu primer factor recibes diez **códigos de recuperación**. Solo se muestran una vez: guárdalos en un lugar seguro. Cada uno sirve una sola vez en lugar de tu segundo factor, por ejemplo si pierdes el móvil. Puedes crear un juego nuevo cuando quieras, que sustituye al anterior.

Cuando tienes un segundo factor, cada inicio de sesión lo pide. Si tu campus o uno de tus roles exige un segundo factor y aún no tienes ninguno, el inicio de sesión te pide configurar primero una aplicación de autenticación. Añadir o quitar un factor pide tu contraseña de nuevo si iniciaste sesión hace más de 15 minutos, y cada vez recibes un correo.

## Recuperar el acceso

Si olvidas tu contraseña, pide un enlace de recuperación con tu correo; dura 30 minutos. Si tu cuenta tiene un segundo factor, debes dar un código de tu aplicación o un código de recuperación antes de elegir la contraseña nueva; un código por correo no vale, porque el enlace ya llegó por correo. Recuperar el acceso termina todas tus sesiones y tokens de API, y vuelves a iniciar sesión con la contraseña nueva. Puedes pedir como máximo tres enlaces por hora.
