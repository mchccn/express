import match from "./match";
import { Context, RouteCallback } from "./types";

export default class Route {
    private matcher: ReturnType<typeof match>;

    public constructor(private path: string, private html: string, private callback: RouteCallback) {
        this.matcher = match(this.path, {});
    }

    public get route() {
        return this.path;
    }

    public get template() {
        return this.html;
    }

    public matches(path: string): ReturnType<Route["matcher"]> {
        return this.matcher(new URL(`http://_${path}`).pathname);
    }

    /**
     * Do not call this method; this method should only be called by App.
     *
     * @private
     */
    public async execute(path: string) {
        const match = this.matches(path);

        if (!match) throw new Error("Route does not match this path.");

        const query: Context["query"] = {};

        new URL(`http://_${path}`).searchParams.forEach((value, key) => (query[key] = value));

        const { params } = match as { params: Context["params"] };

        return this.callback({
            url: new URL(window.location.href),
            route: this,
            params,
            query,
        });
    }
}
