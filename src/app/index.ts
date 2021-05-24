import express from "../lib/index";

const app = express();

app.use("/", `hello`, (ctx) => {
    return {
        template: ctx.route.template,
    };
});
