# Actor Boilerplate

A starting point for web apps based on the actor model.

## Chrome Dev Summit Talk

(video not yet uploaded)

## What am I looking at?

This is a very basic web app that uses the [actor model]. The actor model helps you to break your app’s core logic into small pieces that have to communicate with messages instead of using function calls. Adopting this model has multiple benefits on the web:

- Yields to browser
- Encourages lazy-loading and code splitting
- Gives you a clear separation of concerns
- Makes off-main-thread code easier
- Resilience against unexpected long-running tasks
- Enables multi-modality for web apps

We also wrote a series of blog posts with more detail on this:

- [The 9am Rush Hour]
- [Lights, Camera, Action!]
- [Headless Web Development]

## What’s in here?

This boilerplate is a starting point to build web apps based on the actor model. It provides a build system that allows you to easily lazy-load actors split your code. It relies on [actor-helpers] for the implementation of the actors and the messaging system. Both this build system and the actor-helpers library are provided by us for convenience. You are encouraged to explore your own approach to actorize your code.

## How do I use this?

To get started, you can either [download] a snapshot of the master branch or fork this repository. Then run:

```
$ npm install
$ npm run build
$ npm run serve
```

and navigate to the address shown on the console to see the app.

### Static content

All content in `static` will be copied to the root of the output folder. This is the place for stylesheets, images and other files that don’t need any processing at build time.

### Bootstrapping

The entire web app bootstraps itself by loading the `bootstrap.ts` entrypoint. This is where we initialize the messaging system and create workers.

### Actors

All actors are in the `src/actors` folder. If you call `hookup()` in `bootstrap.ts`, the actor will run on the UI thread. If you move that call to `worker.ts`, the actor will run in the worker. The message system takes care of delivering messages, regardless of where the actor is run.

## More examples

- **Todo:** Mandatory Todo app using the actor model with [preact] and [ImmerJS] ([branch][todo])

---

License BSD-3-clause

[actor-helpers]: https://github.com/PolymerLabs/actor-helpers
[download]: https://github.com/PolymerLabs/actor-boilerplate/archive/master.zip
[actor model]: https://en.wikipedia.org/wiki/Actor_model
[paul lewis]: https://twitter.com/aerotwist
[surma]: https://twitter.com/DasSurma
[the 9am rush hour]: https://dassur.ma/things/the-9am-rush-hour/
[lights, camera, action!]: https://dassur.ma/things/lights-camera-action/
[headless web development]: https://dassur.ma/things/headless-web-development/
[todo]: https://github.com/PolymerLabs/actor-boilerplate/tree/example/todo
[preact]: https://preactjs.com/
[immerjs]: https://github.com/mweststrate/immer
