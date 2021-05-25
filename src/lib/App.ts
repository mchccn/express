import Route from "./Route";
import { AppOptions, RouteCallback } from "./types";

export default class App {
    private static instance?: App;

    private routes: Route[] = [];

    /**
     * Creates a new app.
     * @param options Options to configure the app.
     */
    constructor(private options?: AppOptions) {
        if (App.instance) throw new Error(`Cannot create more than one App instance.`);

        App.instance = this;
    }

    /**
     * Registers a new route to the app.
     * @param path Path of the page.
     * @param template Page's template to be used.
     * @param callback Callback to be executed.
     */
    public use(path: string, template: string, callback?: RouteCallback) {
        const route = new Route(path, template, callback ?? ((ctx) => ({ template: ctx.route.template })));

        this.routes.push(route);

        return this;
    }

    /**
     * Do not call this method; this method should only be called by App.
     *
     * @private
     */
    public async update() {
        for (const route of this.routes) {
            const path = (this.options?.hash ? window.location.hash.slice(1) : window.location.pathname) + window.location.search;

            const match = route.matches(path);

            if (match) {
                try {
                    const value = await route.execute(path);

                    if (!value || value.notFound) continue;

                    const props = this.flatten(value.props);

                    const content = this.fill(value.template ?? route.template, props);

                    return this.render(this.options?.sanitizer ? this.options.sanitizer(content) : content);
                } catch (error) {
                    if (this.options?.error) this.render(this.options.error(error));

                    if (!error.message.startsWith("Invalid prop name")) throw new Error("Unable to execute route.");

                    throw error;
                }
            }
        }

        if (this.options?.default) return this.render(this.options.default);

        throw new Error("No route matched.");
    }

    /**
     * Navigates to the path provided.
     * @param path Path to go to.
     */
    public async goto(path: string) {
        if (this.options?.hash) window.location.hash = path;
        else window.history.pushState({}, "", path);

        return this.update();
    }

    /**
     * Starts the app and adds event listeners.
     */
    public async listen() {
        await this.update();

        if (this.options?.hash) return window.addEventListener("hashchange", this.update.bind(this));

        return window.addEventListener("popstate", this.update.bind(this));
    }

    /**
     * Renders a template.
     * @param template Template to render.
     */
    private render(template: string, sanitizer?: (template: string) => string) {
        document.body.innerHTML = "";

        const nodes = Array.from(new DOMParser().parseFromString(sanitizer ? sanitizer(template) : template, "text/html").body.childNodes);

        document.body.append(...nodes);

        return document.querySelectorAll(`[${this.options?.attribute ?? "goto"}]`).forEach((link) => {
            const route = link.getAttribute(this.options?.attribute ?? "goto");

            if (!route) return;

            link.addEventListener("click", (event) => this.goto(route));
        });
    }

    /**
     * Populates the template with the provided props.
     * @param template Template to fill.
     * @param props Props for the template.
     */
    private fill(
        template: string,
        props?: {
            [prop: string]: string;
        }
    ) {
        return Object.entries(props ?? {}).reduce((template, [prop, value]) => template.replaceAll(`{${prop}}`, value), template);
    }

    /**
     * Flattens an object.
     * @param object Object to flatten.
     */
    private flatten(object: any) {
        const flattened = {} as any;

        (function flatten(dictionary, propName) {
            if (typeof dictionary !== "object" || dictionary === null) return (flattened[propName] = dictionary);

            for (const prop of Object.keys(dictionary))
                if (!/[$A-Za-z0-9_-]/.test(prop)) throw new SyntaxError(`Invalid prop name '${prop}'.`);
                else flatten(dictionary[prop], `${propName}${propName ? "." : ""}${prop}`);
        })(object, "");

        return flattened;
    }
}
