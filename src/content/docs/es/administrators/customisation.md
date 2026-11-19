---
title: Personalización
description: Las palabras que usa tu campus, las funciones que desactivas y los campos personalizados de los cursos, por ámbito.
sidebar:
  order: 4
---

Disponible desde 0.1.0.

La personalización cambia Kampus sin código. Todo se fija en un ámbito (la plataforma, un campus, una categoría, un curso o una sección) y vale ahí y debajo: gana el ámbito más cercano que lo fija, salvo que un ámbito superior lo **bloquee**. Cada respuesta dice de dónde viene su valor, y cada cambio queda registrado con quién lo hizo, el antes y el después.

## Las palabras de tu campus

Kampus llama a las cosas por su nombre habitual: curso, categoría, sección. Con `customise.term.manage` las renombras, por idioma, con singular y plural: una facultad puede llamar «asignaturas» a sus cursos mientras otra sigue con «cursos». Un idioma que no renombras conserva la palabra declarada, y quitar tu palabra recupera la de arriba.

| Término | Inglés | Español |
| --- | --- | --- |
| `courses.category` | category / categories | categoría / categorías |
| `courses.course` | course / courses | curso / cursos |
| `courses.section` | section / sections | sección / secciones |

Bloquea una palabra para mantenerla en todos los ámbitos de debajo: renombrarla ahí se rechaza hasta que la desbloquees.

## Desactivar funciones

Con `customise.flag.manage` activas o desactivas funciones en un ámbito. Desactivar una oculta lo que ofrece ahí y conserva sus datos: al reactivarla vuelve todo.

| Función | Activa por defecto | Cuando está desactivada |
| --- | --- | --- |
| `courses.groups` | Sí | Nadie puede crear grupos en los cursos de debajo; los grupos existentes se mantienen |

Un curso o una sección pueden reactivar una función, salvo que un ámbito superior la bloquee desactivada.

## Campos personalizados de los cursos

Con `customise.field.manage` en un campus o una categoría añades campos que tienen todos los cursos de debajo, por ejemplo créditos, un nivel o un tutor. Cada campo tiene un código único en su ámbito, un nombre y un tipo:

| Tipo | Guarda |
| --- | --- |
| Texto | Texto hasta su longitud (1000 caracteres si no fijas otra) |
| Entero | Un número entero |
| Fecha | Un día |
| Booleano | Sí o no |
| Opción | Una de sus opciones |
| Opciones | Cualquiera de sus opciones |
| Cuenta | Una persona del campus |

Un campo es **público**, lo ve quien ve el curso, o **privado**, solo con `customise.field.view`. Los profesores rellenan los campos de sus cursos con `customise.field.edit`. Cuando una categoría define un campo con el mismo código que uno del campus, a sus cursos se les aplica el suyo. Borrar un campo borra sus valores.

## Permisos de personalización

| Permiso | Qué permite | Roles por defecto |
| --- | --- | --- |
| `customise.term.manage` | Renombrar las palabras de un ámbito | Administradores, Gestor, Profesor |
| `customise.flag.manage` | Activar o desactivar funciones | Administradores, Gestor |
| `customise.field.manage` | Añadir y borrar campos personalizados | Administradores, Gestor |
| `customise.field.view` | Ver los campos personalizados privados | Administradores, Gestor, Profesor, Profesor sin edición |
| `customise.field.edit` | Rellenar los campos personalizados de un curso | Administradores, Gestor, Profesor |
