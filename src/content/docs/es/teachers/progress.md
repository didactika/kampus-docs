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

Una persona está **sin empezar** hasta que hace algo, **en curso** mientras falte algo de lo pedido, y **hecha** cuando cumple todas las reglas. Con una regla de aprobar acaba **aprobada** o **suspensa** según la nota: una nota por debajo del aprobado la termina aunque queden otras reglas pendientes.

Kampus sigue a cada persona cuando ve, entrega, marca y recibe notas, y el estado se actualiza solo. Cuando cambias las reglas de un módulo, Kampus vuelve a evaluar poco después a quienes ya habían hecho algo.

## Decidir un estado a mano

Si las reglas no recogen lo ocurrido (una entrega en papel, una recuperación), fija el estado de una persona en un módulo y explica por qué. Tu decisión gana a las reglas, con tu motivo y la fecha guardados, hasta que la quites; entonces vuelve a contar el estado que dan las reglas. Cambiar las reglas nunca pisa tus decisiones.

## Qué ve el alumnado

Cada persona ve sus propios estados. Mientras la nota de la que depende una regla de aprobar está oculta, ve que la actividad está hecha pero no si aprobó. Tú ves el resultado.

| Permiso | Qué permite | Roles por defecto |
| --- | --- | --- |
| `progress.view_own` | Ver el propio progreso | Todas las personas del curso |
| `progress.view_all` | Ver el progreso de todos | Profesorado, profesorado sin edición, gestores, administradores |
| `progress.mark_own` | Marcar una actividad como hecha | Alumnado |
| `progress.exception` | Decidir un estado con un motivo | Profesorado, gestores, administradores |
| `progress.manage` | Elegir qué pide cada actividad | Profesorado, gestores, administradores |
