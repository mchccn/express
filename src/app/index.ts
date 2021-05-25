import express from "../lib/index";

const app = express({
    hash: true,
    default: `404 thats an error`,
});

app.use(
    "/",
    `
    <p>hello world</p>

    <a goto="/about">click me</a>

    <a goto="/nowhere">also me</a>
    `
);

app.use(
    "/about",
    `
    <p>foo bar baz</p>

    <a goto="/">click me</a>
    `
);

app.use(
    "/info/:id",
    `
    <p>the id is {id}</p>
    `,
    (ctx) => {
        return {
            props: { id: ctx.params.id, nested: { object: "errors" } },
            template: ctx.route.template,
        };
    }
);

app.listen();
