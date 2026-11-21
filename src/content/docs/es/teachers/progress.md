---
title: Progreso
description: Qué pide cada actividad, cómo lo sigue Kampus y cómo decidir un estado a mano.
sidebar:
  order: 5
---

Disponible desde la 0.1.0. La finalización del curso y los requisitos previos llegan en una versión posterior.

## Qué pide una actividad

Para cada módulo de curso eliges qué debe hacer el alumnado para que cuente como hecho, en cualquier combinación:

| Regla | La persona ha terminado cuando… |
| --- | --- |
| Ver | lo abre |
| Entregar | entrega algo |
| Calificar | recibe una nota |
| Aprobar | alcanza la nota de aprobado de su registro de calificación |
| Marcar | lo marca como hecho ella misma |
| Una regla de su tipo | la actividad lo indica, para reglas que ofrece un tipo como un cuestionario, por ejemplo usar todos los intentos |

Una persona está **sin empezar** hasta que hace algo, **en curso** mientras falte algo de lo pedido, y **hecha** cuando cumple todas las reglas. Con una regla de aprobar acaba **aprobada** o **suspensa** según la nota: una nota por debajo del aprobado la termina aunque queden otras reglas pendientes.

Kampus sigue a cada persona cuando ve, entrega, marca y recibe notas, y el estado se actualiza solo. Cuando cambias las reglas de un módulo, Kampus vuelve a evaluar poco después a quienes ya habían hecho algo.

## Decidir un estado a mano

Si las reglas no recogen lo ocurrido (una entrega en papel, una recuperación), fija el estado de una persona en un módulo y explica por qué. Tu decisión gana a las reglas, con tu motivo y la fecha guardados, hasta que la quites; entonces vuelve a contar el estado que dan las reglas. Cambiar las reglas nunca pisa tus decisiones.

## Qué ve el alumnado

Cada persona ve sus propios estados. Mientras la nota de la que depende una regla de aprobar está oculta, ve que la actividad está hecha pero no si aprobó. Tú ves el resultado.

## Completar el curso

Decides qué significa completar el curso con **criterios**, y si una persona necesita todos o cualquiera de ellos:

| Criterio | Se cumple cuando |
| --- | --- |
| Actividad | Un módulo del curso está hecho, o aprobado |
| Nota | Una nota del curso llega a un porcentaje de su rango |
| Fecha | Ha llegado un momento |
| Duración | La persona lleva unos días participando en el curso sin interrupción |
| Aprobación | Alguien con un rol en el curso, como un profesor, aprueba a la persona |
| Otro curso | La persona completó otro curso |

Kampus sigue a quienes participan activamente y tienen `progress.tracked`, que tiene el alumnado. Cada vez que cambia algo de lo que depende un criterio, vuelve a comprobarlo en unos minutos, y revisa fechas y duraciones una vez al día. Cuando una persona cumple los criterios, el curso queda completado para ella, con la fecha, y se le avisa. Si un criterio deja de cumplirse, por ejemplo porque baja una nota, la finalización se revoca y queda registrada, salvo que digas que una finalización es definitiva.

Para aprobar a alguien tienes que tener en el curso el rol que nombra el criterio. Un curso no puede exigirse a sí mismo, ni siquiera a través de otros cursos. Cambiar los criterios conserva las aprobaciones de los que no cambian, y se vuelve a comprobar a todo el mundo. Ves el progreso de todos en el curso, cada criterio con si se cumple; cada estudiante ve el suyo.

## Cursos exigidos antes

Un curso puede exigir que se hayan completado otros antes de que alguien se matricule en él por su cuenta. A quien no los ha completado se le dice al intentarlo; un profesor que matricula a alguien a mano no queda bloqueado. Ves qué exige un curso y qué cursos lo exigen a él. Un curso no puede exigirse a sí mismo, ni a través de otros cursos ni a través de sus criterios de finalización.

| Permiso | Qué permite | Roles por defecto |
| --- | --- | --- |
| `progress.view_own` | Ver el propio progreso | Todas las personas del curso |
| `progress.view_all` | Ver el progreso de todos | Profesorado, profesorado sin edición, gestores, administradores |
| `progress.mark_own` | Marcar una actividad como hecha | Alumnado |
| `progress.exception` | Decidir un estado con un motivo | Profesorado, gestores, administradores |
| `progress.manage` | Elegir qué pide cada actividad y el curso | Profesorado, gestores, administradores |
| `progress.tracked` | Ser seguido por el progreso del curso | Alumnado |
