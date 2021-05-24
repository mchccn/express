import Route from "./Route";
import { AppOptions, RouteCallback } from "./types";

export default class App {
    private static instance?: App;

    private routes: Route[] = [];

    constructor(private options?: AppOptions) {
        if (App.instance) throw new Error(`Cannot create more than one App instance.`);

        App.instance = this;
    }

    public use(path: string, template: string, callback: RouteCallback) {
        const route = new Route(path, template, callback);

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
            const path = window.location.pathname + window.location.search;

            const match = route.matches(path);

            if (match) {
                try {
                    const value = await route.execute(path);

                    if (!value || value.notFound) continue;

                    document.body.innerHTML = "";

                    const nodes = Array.from(new DOMParser().parseFromString(value.template, "text/html").childNodes);

                    document.body.append(...nodes);

                    break;
                } catch {}
            }
        }
    }

    public async listen() {
        await this.update();

        if (this.options?.hash) return window.addEventListener("hashchange", (event) => {
            
        });

        return window.addEventListener("popstate", (event) => {
            console.log(event.state);
        });
    }
}
