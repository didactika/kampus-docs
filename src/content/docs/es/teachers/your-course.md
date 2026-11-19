---
title: Tu curso
description: Preparar un curso, sus secciones, publicarlo y archivarlo, y repartir a las personas en grupos.
sidebar:
  order: 1
---

Disponible desde 0.1.0.

## Prepararlo

Un curso nuevo es un borrador con una sección sin título, y tú, que lo creaste, eres su propietario y profesor. Dale un nombre corto, único en el campus, un nombre completo y, si quieres, un código, un resumen, fechas y un idioma. El formato (temas por defecto) solo decide cómo se presenta el curso: cambiarlo conserva todas las secciones.

Si alguien cambió el curso mientras lo editabas, Kampus te pide recargar en lugar de sobrescribir su cambio.

## Secciones

Las secciones organizan el curso. Una sección puede contener otras, con la profundidad que quieras, y colocas cada una la primera, la última, o justo antes o después de otra. Mover una sección mueve todo lo que contiene, secciones y permisos incluidos, y no cambia nada más.

Cada sección está visible, oculta, o visible solo entre dos fechas. Ocultar una sección oculta a los estudiantes lo que contiene; tú la sigues viendo, marcada como oculta. Volver a mostrarla recupera exactamente lo que había.

Borrar una sección borra también las secciones que contiene, pero puedes restaurarla, con todo lo que se borró con ella. Una sección cuyo padre está borrado vuelve con su padre.

## Publicar y archivar

Publica el curso cuando esté listo. Puedes devolverlo a borrador mientras nadie participe en él. Cuando un curso termina, archívalo: todo se conserva, en solo lectura, hasta que lo publiques de nuevo. Como propietario también puedes programar su borrado, que ocurre a los 14 días salvo que lo canceles; cancelarlo lo devuelve a borrador.

## Grupos

Los grupos reparten a las personas del curso. Cada grupo tiene un nombre único en el curso y puede limitarse a una sección: entonces solo pueden unirse quienes ven esa sección. Quién ve un grupo lo decides tú:

| Visible para | Quién ve el grupo y sus miembros |
| --- | --- |
| Todos | Todo el curso |
| Miembros | Sus miembros; los demás no lo ven |
| Cada miembro | Cada miembro ve el grupo y solo a sí mismo |
| Nadie | Solo quienes gestionan grupos |

Un grupo visible solo para cada miembro, o para nadie, no puede usarse para trabajar en grupos, porque sus miembros no se verían entre sí.

Tú añades personas a mano. Otras partes de Kampus, como las matriculaciones, también pueden añadir personas a un grupo; quitar a alguien a mano nunca quita lo que ellas añadieron, y ellas nunca quitan a quien añadiste tú.

Los **conjuntos de grupos** reúnen grupos del curso, por ejemplo los grupos de laboratorio; un grupo puede estar en varios conjuntos, y una sola vez en cada uno.

## Palabras y campos personalizados

Tu campus puede llamar a los cursos, las secciones o las categorías con otros nombres, y tú también puedes renombrarlos en tu curso, por idioma: un curso puede llamar «semanas» a sus secciones. Una palabra que tu campus bloquea se queda como está. Si los grupos están desactivados donde está tu curso, no puedes crear grupos, y los que ya existen se mantienen.

Tu campus también puede dar a los cursos campos personalizados, como créditos o un nivel. Rellénalos en tu curso con `customise.field.edit`, que tienen los profesores; cada valor debe encajar en su campo (un número, una fecha, una de sus opciones…), y vaciarlo deja el campo sin valor. Los campos privados solo los ve quien puede verlos.
