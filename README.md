# Actor Boilerplate

A starting point for web apps based on the actor model.

## Chrome Dev Summit Talk

_(video not yet uploaded)_

We also wrote a series of blog posts with more detail on web development with the actor model:

- [The 9am Rush Hour]
- [Lights, Camera, Action!]
- [Headless Web Development]

## What is this repository that am I looking at?

This is a very basic web app that uses the [actor model]. The actor model helps you to break your app’s core logic into small pieces that have to communicate with messages instead of using function calls. Adopting this model has multiple benefits on the web:

- Yields to browser (it naturally leads to chunked code)
- Encourages lazy-loading and code splitting
- Gives you a clear separation of concerns
- Makes moving code off-main-thread easier
- Resilience against unexpected long-running tasks
- Enables multi-modality for web apps

## What’s in here?

This boilerplate is a starting point to build web apps based on the actor model. It provides a build system that allows you to easily lazy-load actors and split your code. It relies on [actor-helpers] for the implementation of the actors and the messaging system. (Please read the docs of [`actor.ts`][actor.ts] for more details and examples.) 

Both this build system and the actor-helpers library are provided by us for convenience. You are encouraged to explore your own approach to actorize your code.

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

All actors are in the `src/actors` folder. For example, the state actor runs in a worker as we call `hookup("state", new StateActor())` in `worker.ts`. However, if an actor explicitly requires access to the DOM, you can use this call in `bootstrap.ts` as well.

The message system takes care of delivering messages, regardless of where the actor is run. We strongly encourage to default all actors in a worker and only run an actor on the main thread if necessary.

Note that while we have a single `worker.ts` in this project, larger projects can create as many workers as they like. Since messages are delivered irrespective of where an actor lives, you can assign any actor to any worker.

For example, if you have one actor that performs very expensive tasks, such as encoding and decoding messages, that actor can live in its own worker. Other (less CPU-intensive) actors can be grouped together in a single worker.

## More examples

- **Todo note-taking app:** Mandatory Todo app using the actor model with [preact] and [ImmerJS] ([branch][todo])

---

License BSD-3-clause

[actor-helpers]: https://github.com/PolymerLabs/actor-helpers
[actor.ts]: https://github.com/PolymerLabs/actor-helpers/blob/master/src/actor/Actor.ts
[download]: https://github.com/PolymerLabs/actor-boilerplate/archive/master.zip
[actor model]: https://en.wikipedia.org/wiki/Actor_model
[the 9am rush hour]: https://dassur.ma/things/the-9am-rush-hour/
[lights, camera, action!]: https://dassur.ma/things/lights-camera-action/
[headless web development]: https://dassur.ma/things/headless-web-development/
[todo]: https://github.com/PolymerLabs/actor-boilerplate/tree/example/todo
[preact]: https://preactjs.com/
[immerjs]: https://github.com/mweststrate/immer
