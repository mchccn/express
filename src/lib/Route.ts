import match from "./match";
import { Context, RouteCallback } from "./types";

export default class Route {
    private matcher: ReturnType<typeof match>;

    /**
     * Creates a new route.
     * @param path Path of the route.
     * @param html Route's template HTML.
     * @param callback Route's callback function.
     */
    public constructor(private path: string, private html: string, private callback: RouteCallback) {
        this.matcher = match(this.path, {});
    }

    /**
     * The route's path.
     */
    public get route() {
        return this.path;
    }

    /**
     * The route's template.
     */
    public get template() {
        return this.html;
    }

    /**
     * Returns true if the path matches this route.
     * @param path Path to test.
     */
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

        const { params } = match as { params: Context["params"] };

        return this.callback({
            url: new URL(window.location.href),
            route: this,
            params,
            query: Object.fromEntries([...new URL(`http://_${path}`).searchParams.entries()]),
        });
    }
}
