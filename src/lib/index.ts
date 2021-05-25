import App from "./App";
import { AppOptions } from "./types";

/**
 * Bootstraps a new application.
 * @param options Options for the app.
 */
export default function express(options?: AppOptions) {
    const app = new App(options);

    return app;
}
