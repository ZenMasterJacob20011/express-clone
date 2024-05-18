import {IncomingMessage, Server, ServerResponse} from "node:http";

declare function expressClone(): expressClone.Application

declare namespace expressClone {
    interface Application {
        get: IRoute;
        post: IRoute;
        put: IRoute;
        delete: IRoute;
        listen: (port: string | number, callback?: () => void) => Server;
        use: IUse;
    }

    interface NextFunction {
        (err?: any): void,

        (deferToRoute: "route"): void,

        (deferToRouter: "router"): void
    }

    interface IRouteHandler {
        (req: Request, res: Response, next: NextFunction): void
    }

    interface IRoute {
        (path: string | RegExp, callback: IRouteHandler): void
    }

    interface IRouter extends IRouteHandler{
        get: IRoute
        post: IRoute
        put: IRoute
        delete: IRoute
        use: IUse
    }

    interface IUse {
        (path: string | RegExp, callback: IRouteHandler)

        (callback: IRouteHandler)
    }

    interface Response extends ServerResponse {
        send(body?: string | number | boolean | object | Buffer): this;

        sendFile(path: string, options?: object): void;

        get(field: string): string;

        set(field: any): this;

        set(field: string, val: string[] | string): this;

        type(type: string): this

        status(status: number): this

        sendStatus(statusCode: number): this
    }

    interface Request extends IncomingMessage{
        params: paramsDictionary
    }

    interface paramsDictionary{
        [key: string]: string
    }

    export function Router(): IRouter
}

export = expressClone
