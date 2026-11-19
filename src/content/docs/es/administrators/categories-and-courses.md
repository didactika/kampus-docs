---
title: Categorías y cursos
description: El árbol de categorías de un campus, crear cursos, su ciclo de vida, el contenido oculto y el borrado.
sidebar:
  order: 3
---

Disponible desde 0.1.0.

## Categorías

Los cursos viven en un árbol de categorías bajo el campus. Una categoría puede contener cursos y otras categorías, con la profundidad que necesites. Con `courses.category.manage` creas, renombras, describes, mueves y borras categorías; tenerlo en una categoría te permite gestionar todo lo que hay debajo.

El orden de las categorías lo decides tú: colocas cada una la primera, la última, o justo antes o después de otra, y mover una nunca cambia las demás. El código de una categoría es opcional y único en el campus, sin importar las mayúsculas. Solo puedes borrar una categoría vacía: antes mueve o borra sus cursos y categorías.

Mover una categoría mueve todo lo que contiene, y los roles que las personas tienen ahí se mueven con ella.

## Crear un curso

Con `courses.course.create` en una categoría, una persona crea cursos en ella. Un curso nuevo es un **borrador** con una sección sin título. Quien lo crea pasa a ser su **propietario** y **profesor** en él, así que puede prepararlo enseguida. El nombre corto de un curso es único en el campus, sin importar las mayúsculas, y también su código cuando lo tiene. Si un curso tiene fechas, termina después de empezar.

Da el rol **Creador de cursos** en una categoría a quien deba crear cursos en ella.

## Ciclo de vida

| Estado | Qué significa |
| --- | --- |
| Borrador | En preparación |
| Publicado | Abierto a sus participantes |
| Archivado | Se conserva en solo lectura: nada en él puede cambiar hasta que se publique de nuevo |
| Borrado programado | Se borra al terminar el periodo de gracia (14 días) |

Los profesores publican un curso y lo devuelven a borrador mientras nadie participe en él. Archivar y desarchivar requiere `courses.course.archive`. Sus propietarios, o quien tenga `courses.course.delete`, programan su borrado desde cualquier estado, y cancelarlo devuelve el curso a borrador. Un profesor que no es propietario del curso no puede borrarlo.

## Contenido oculto

Cada categoría, curso y sección está visible, oculto, o visible solo entre dos fechas. Ocultar algo nunca cambia lo que hay dentro: un estudiante ve un curso solo si el curso y todas las categorías por encima están visibles, así que ocultar una categoría y volver a mostrarla recupera exactamente lo que había, incluido un curso que estaba oculto por sí mismo.

Quien tiene `courses.hidden.view` ve el contenido oculto, marcado como oculto. Lo tienen en su ámbito los administradores, gestores, profesores, profesores sin edición y líderes de sección.

## Permisos de cursos

| Permiso | Qué permite | Roles por defecto |
| --- | --- | --- |
| `courses.category.manage` | Crear, editar, mover y borrar categorías | Administradores, Gestor |
| `courses.course.create` | Crear cursos en una categoría | Administradores, Gestor, Creador de cursos |
| `courses.course.update` | Editar un curso, publicarlo y devolverlo a borrador | Administradores, Gestor, Profesor |
| `courses.course.archive` | Archivar un curso y recuperarlo | Administradores, Gestor, Profesor |
| `courses.course.delete` | Programar y cancelar el borrado de un curso; sus propietarios también pueden | Administradores, Gestor |
| `courses.hidden.view` | Ver categorías, cursos y secciones ocultos | Administradores, Gestor, Profesor, Profesor sin edición, Líder de sección |
| `courses.section.manage` | Añadir, editar, mover, ocultar y borrar secciones | Administradores, Gestor, Profesor, Líder de sección |
| `courses.groups.manage` | Crear grupos y conjuntos de grupos y gestionar sus miembros | Administradores, Gestor, Profesor |
| `courses.groups.access_all` | Ver y trabajar con todos los grupos | Administradores, Gestor, Profesor, Profesor sin edición |
