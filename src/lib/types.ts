import Route from "./Route";

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

export type RouteCallbackReturn =
    | false
    | {
          notFound?: boolean;
          props?: boolean;
          template: string;
      };

export type RouteCallback = (ctx: Context) => RouteCallbackReturn | Promise<RouteCallbackReturn>;

export type AppOptions = {
    hash?: boolean;
};
