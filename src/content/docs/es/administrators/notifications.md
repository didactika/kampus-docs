---
title: Notificaciones
description: Qué reciben por correo y push las personas de tu campus, los textos que leen y qué pueden cambiar.
sidebar:
  order: 8
---

Disponible desde la 0.1.0.

## Canales

Cada tipo de notificación puede llegar a la bandeja de las personas, por correo y como notificación push en los navegadores y móviles que permitan. Cada tipo viene con los canales que eligió su módulo, y cada persona los cambia canal por canal. Los tipos obligatorios siempre llegan a la bandeja.

## Valores por defecto del campus

Con `notify.defaults.manage` fijas lo que da el campus para un tipo en un canal, por ejemplo las notas por correo. Quien no eligió otra cosa recibe tu valor. Cuando **bloqueas** un valor, se aplica a todo el mundo y nadie puede cambiarlo: así haces obligatorio un canal o lo prohíbes.

## Textos

Con `notify.template.manage` escribes el asunto y el texto del correo y del push de cada tipo e idioma. Escribe `{{summary}}` para la descripción del tipo y el nombre de un campo de la notificación, como `{{course}}`, para su valor. Cada persona recibe el texto en su idioma, o en inglés si no hay en el suyo, y la descripción del tipo si no hay ningún texto.

## Envío

El correo y el push salen unos instantes después de lo que los causó, nunca mientras espera quien lo causó. Si falla el envío, Kampus vuelve a intentarlo más tarde, esperando cada vez más, y lo deja tras cinco intentos. A quien no tiene dirección de correo, o ningún navegador o móvil permitido, se le salta en ese canal. Hasta que la operación configure cómo se envían el correo y el push, el servidor los escribe en su registro.
