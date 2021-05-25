import Route from "./Route";

/**
 * Route callback execution context.
 */
export type Context = {
    url: URL;
    route: Route;
    params: {
        [param: string]: string;
    };
    query: {
        [param: string]: string;
    };
};

/**
 * Props for a route.
 */
export type Props = {
    [prop: string]: string | number | boolean | symbol | bigint | Props;
};

/**
 * Type of a route's callback's return value.
 */
export type RouteCallbackReturn =
    | false
    | {
          notFound?: boolean;
          props?: Props;
          template?: string;
      };

/**
 * Type of a route's callback.
 */
export type RouteCallback = (ctx: Context) => RouteCallbackReturn | Promise<RouteCallbackReturn>;

/**
 * Options for the app.
 */
export type AppOptions = {
    /**
     * Use the hash for routing instead.
     */
    hash?: boolean;
    /**
     * Default template if no routes matched.
     */
    default?: string;
    /**
     * Template to rendered if an error occured.
     */
    error?: (error: Error) => string;
    /**
     * Attribute to look for to register links.
     */
    attribute?: string;
    /**
     * Sanitizer to purify templates.
     */
    sanitizer?: (ctx: string) => string;
};
