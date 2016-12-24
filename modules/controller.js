import decorators from "hapi-decorators";

class Controller {

    constructor(baseUrl, config) {
        this.baseUrl = Controller.trimslash(baseUrl || '/');

        this.config = config || {};
        if (!this.config.plugins) this.config.plugins = {};
    }

    plugin(name, conf) {
        if (!this.config.plugins[name])
            this.config.plugins[name] = {};
        this.config.plugins[name] = Object.assign({}, conf, this.config.plugins[name]);
    }

    get routes() {
        if (!this.rawRoutes) return [];
        return this.rawRoutes.map((route) => {
            if (!route.path)
                throw new Error('Route path must be set with `@route` or another alias');
            route.path = (this.baseUrl + Controller.trimslash(route.path)) || '/';
            route.config.bind = this;
            route.config = Object.assign({}, route.config, this.config);
            return route;
        });
    }

    static trimslash(s) {
        return s[s.length - 1] === '/' ? s.slice(0, s.length - 1) : s
    }

}

module.exports = {
    Controller,
    ...decorators
};