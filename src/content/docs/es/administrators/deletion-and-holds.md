---
title: Peticiones de borrado y retenciones legales
description: Aprobar o rechazar el borrado de los datos de una persona, y mantenerlo en espera mientras el campus deba conservarlos.
sidebar:
  order: 7
---

Disponible desde la 0.1.0.

## Quién decide

Una persona pide el borrado de sus datos y da un motivo. Quien tiene `privacy.request.approve` en el campus lo aprueba o lo rechaza; los administradores del campus y de la plataforma lo tienen desde el principio. Las peticiones que esperan decisión se listan de la más antigua a la más reciente. Quien pide un borrado y puede aprobarlo no tiene que esperar.

Con `privacy.request.manage` puedes pedir el borrado de los datos de otra persona, por ejemplo cuando te lo pidió por escrito; dilo en el motivo, porque queda registrado junto con quién lo aprobó.

## Qué pasa cuando aprueban

Cada parte de Kampus borra lo que solo afecta a la persona. Se borran las notificaciones y las entradas personales del calendario. Las notas, el progreso y la prueba de qué políticas aceptó se conservan, porque pertenecen al expediente académico; apuntan a la cuenta, que queda como una lápida: sin usuario, correo ni contraseña, y con un nombre inventado. La persona no puede volver a entrar. Todo queda auditado: la petición, quién la aprobó y el borrado.

Rechazar una petición no cambia nada, y la persona puede volver a pedirlo.

## Retenciones legales

Con `privacy.hold.manage` pones una retención sobre una persona, o sobre todo el campus, con el motivo y, si quieres, una fecha en la que termina sola. Mientras una retención está activa, un borrado aprobado espera y aparece como retenido; sigue solo cuando liberas la retención o pasa su fecha. Las retenciones no impiden pedir ni aprobar: solo impiden el borrado.

## Cuánto tiempo se conservan los datos

Las notas, el progreso y la prueba de aceptación se conservan después de borrar una cuenta. Con `privacy.retention.manage` decides durante cuántos días, para cada tipo de dato que declaran los módulos; sin número, el dato se conserva para siempre. Cuando pasan esos días desde el borrado, un trabajo diario purga esos datos definitivamente, salvo que una retención legal cubra la cuenta: entonces espera a que esta termine. Cada purga queda auditada y no se repite.
