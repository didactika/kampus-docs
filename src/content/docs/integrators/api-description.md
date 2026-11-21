---
title: The API description
description: The OpenAPI document every installation serves, read from the routes it really has.
sidebar:
  order: 3
---

Available since 0.1.0.

## Where it is

`GET /api/v1/openapi.json` returns an OpenAPI 3.1 document of the API that installation serves. It is read from the routes the installed modules mounted, so it lists exactly what answers: a module that is not installed has no paths, and a route that does not exist is never listed. Use it to generate a client or to explore the API in a tool of your choice.

## What it says

Every path and method, grouped by module (the first segment of the path, with the module summary as the tag description), the path parameters, the two ways of authenticating (the session cookie and the bearer token), the header `x-kampus` that a request that changes something with a session cookie must carry, and the problem document every error uses. Operation names are stable: the method and the path, such as `get_privacy_requests`.

It does not describe the bodies of requests and answers yet; those are in the guides of each role.
