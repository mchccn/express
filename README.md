# @cursorsdottsx/express

> Express.js, but for the client side.

## Introduction

@cursorsdottsx/express brings the minimalistic Express.js API to the frontend, so that client side routing isn't an overhead at all.

It has an API similar to Express, but naturally, it does not have as many features because it is on the frontend.

### Installation and usage

Installing is very easy with NPM or Yarn:

```bash
npm install @cursorsdottsx/express
```

```bash
yarn add @cursorsdottsx/express
```

Using it is equally as easy:

```js
import express from "@cursorsdottsx/express";

const app = express();
```

# Documentation

## Definitions

`express(options)` – **Creates a new app.**

-   `options` – App options.

    -   `hash` – Use the hash for client side routing instead.
    -   `attribute` – Attribute to look for to register links.
    -   `default` – Default template if no route matches.
    -   `error` – Template to render if an error occured.
    -   `sanitizer` – Sanitizer to purify templates.

`App#use(path, template, callback)` – **Registers a new route.**

-   `path` – Route's path to match.
-   `template` – The template to render.
-   `callback` – Used to provide props and/or an alternative template.

`App#listen()` – **Starts the app and adds event listeners.**

`App#update()` – **Triggers an update in the app.**

`App#goto(path)` – **Navigates to the provided path.**

-   `path` – Path to go to.

## Basic routing

## Route callbacks

The third parameter to `App#use` is called when the route gets matched.
Its return value is used to decide what gets rendered.
Since its optional, if it is not provided, the route's default template will be rendered.

### Not found

You can choose to display a 404 if you wish, by either returning false, or `{ notFound: true }`.
This will display the next route if it matches, and so on and so on.
If no routes match, the default template will be rendered.

```js
app.use(
    "/secret/:id",
    `
        <p>This is a secret!</p>
    `,
    async (ctx) => {
        const user = await queryDatabase();

        if (!user) return { notFound: true };

        return { ... };
    }
);
```

### Props

Along with displaying a 404, you can also pass props to the template.
All you have to do is return a props object with the desired keys and values.
Keys must satisfy this regex, however: `/[$A-Za-z0-9_-]/`.
Values can be any primitive, or an object with more keys and values.

```js
app.use(
    "/secret/:id",
    `
        <p>This is a secret!</p>
    `,
    async (ctx) => {
        const user = await queryDatabase();

        if (!user) return { notFound: true };

        return {
            props: {
                id: ctx.params.id,
                user: {
                    username: user.username,
                },
            },
        };
    }
);
```

### Templating

Finally, we have templating. Note that this does not sanitize input and does a raw search and replace. You can pass a sanitizer to the app to sanitize input yourself with a library like DOMPurify. Templating is very easy; it's simply `{prop}`. Accessing nested values is also possible using dot notation.

```js
app.use(
    "/secret/:id",
    `
        <h1>Hi {user.username}!</h1>

        <p>This is a secret! ID: {id}</p>
    `,
    async (ctx) => {
        const user = await queryDatabase();

        if (!user) return { notFound: true };

        return {
            props: {
                id: ctx.params.id,
                user: {
                    username: user.username,
                },
            },
        };
    }
);
```

## Contributing

Inside the folder `src/lib` is the actual library that you can ~~copy and paste~~ use in your own apps.
`src/app` contains the code for the demonstration and example.
When contributing, make sure to edit the `lib` folder and make any necessary changes to the `app` folder if the API was modified.

When you are done, open a pull request and we'll look it at right away.

Make sure to include/describe the new feature, bug fix, or addition to the library.


