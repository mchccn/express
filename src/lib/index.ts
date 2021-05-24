import App from "./App";
import { AppOptions } from "./types";

export default function express(options?: AppOptions) {
    const app = new App(options);

    return app;
}
