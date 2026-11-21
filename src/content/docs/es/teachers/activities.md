---
title: Actividades y materiales
description: Añadir páginas y ficheros a tu curso, colocarlos y moverlos, y recuperar lo que borras.
sidebar:
  order: 3
---

Disponible desde 0.1.0.

## Añadir contenido

Cada sección de tu curso contiene **módulos de curso**: las actividades que la gente hace y los materiales que lee. Añades uno eligiendo su tipo, dándole un título y colocándolo en una sección, el primero, el último o junto a otro. Hoy Kampus ofrece dos materiales:

| Tipo | Qué es |
| --- | --- |
| Página | Una página de texto |
| Fichero | Un fichero para descargar, como un programa o unas diapositivas |

Otras partes de Kampus añaden más tipos, como cuestionarios o tareas, y aparecen en la misma lista.

De cada módulo de curso eliges si está **visible**, **oculto** o **visible solo un tiempo**, y si aparece en la página del curso. Un módulo oculto, o en una sección oculta, no lo ven los alumnos; tú lo sigues viendo, marcado como oculto. El fichero de un material lo puede leer exactamente quien puede ver el material.

## Cambiar, mover y copiar

Puedes editar un módulo de curso cuando quieras; si otra persona lo cambió mientras tanto, Kampus te avisa en vez de pisar su trabajo. Mueve un módulo a otro lugar de su sección, o a otra sección del mismo curso; cópialo a cualquier sección, y un material de fichero copiado tiene su propia copia del fichero sin ocupar más espacio por el mismo contenido.

## La papelera

Borrar un módulo de curso lo envía a la papelera del curso, donde está 30 días. Desde ahí puedes restaurarlo al lugar donde estaba, mientras su sección siga existiendo. Pasados los 30 días Kampus lo elimina para siempre, con su fichero; si eliminarlo falla, se queda en la papelera con el motivo para que lo veas.

## Excepciones para una persona o un grupo

Algunos tipos, como los cuestionarios y las tareas, permiten dar a una persona o a un grupo otra fecha de apertura o de cierre, de entrega o límite, otro tiempo máximo u otro número de intentos, sin cambiar la actividad para el resto. Cada persona o grupo tiene como mucho una excepción por módulo de curso; conceder otra la reemplaza, y puedes añadir un motivo. Kampus decide qué se aplica a alguien en este orden, ajuste por ajuste: su propia excepción, luego la más generosa de las excepciones de los grupos a los que pertenece (la apertura más temprana, el cierre más tardío, el límite mayor) y por último la propia actividad. Un tipo que no admite excepciones, como una página, las rechaza.

## Restringir el acceso

Puedes decir quién puede abrir un módulo de curso, o todo lo que hay en una sección, con **condiciones de acceso**. Cada condición es una de estas:

| Condición | Se cumple cuando |
| --- | --- |
| Fecha | Ahora es después de un momento, antes de un momento, o entre ambos |
| Grupo | La persona pertenece a un grupo que eliges, a uno de los grupos de una agrupación o a cualquier grupo del curso |
| Perfil | Un campo de su perfil (nombre, nombre visible, idioma, zona horaria) es, no es, contiene, empieza o acaba por un valor, o está vacío |
| Progreso | Otro módulo del curso está hecho, sin hacer, aprobado o suspendido |
| Nota | Una nota del curso llega al menos a un porcentaje de su rango, queda por debajo de otro, o entre ambos |

Las combinas en un árbol: **todas**, **alguna** o **ninguna** de ellas, y puedes anidarlas hasta diez niveles. Las condiciones de una sección se aplican a todos los módulos que contiene y a los de sus subsecciones, junto con las suyas propias.

Cuando alguien no cumple las condiciones, eliges si sigue viendo el módulo en la lista, sin su contenido, para que sepa qué le falta, o si no lo ve en absoluto. Las notas y el progreso se leen tal y como Kampus los guarda, aunque la persona todavía no pueda ver su nota. El profesorado, y quien tenga `activities.conditions.ignore`, abre todo.

Borrar un módulo del que depende una condición de progreso se rechaza, para que nunca rompas un itinerario por accidente; también puedes elegir quitar esas condiciones al borrarlo. Si se borra un grupo, una agrupación o una nota de la que depende una condición, esa condición ya no se puede cumplir: el árbol la muestra como rota y el módulo sigue cerrado hasta que la arregles.

| Permiso | Qué permite | Roles por defecto |
| --- | --- | --- |
| `activities.module.manage` | Añadir, cambiar, mover, copiar, borrar y restaurar módulos de curso | Administradores, Gestor, Profesor, Responsable de sección |
| `activities.exception.manage` | Conceder, cambiar y quitar excepciones de fechas, tiempos máximos e intentos | Administradores, Gestor, Profesor, Responsable de sección |
| `activities.conditions.manage` | Poner y quitar las condiciones de acceso de módulos y secciones | Administradores, Gestor, Profesor, Responsable de sección |
| `activities.conditions.ignore` | Abrir los módulos digan lo que digan sus condiciones | Administradores, Gestor, Profesor, Responsable de sección |
