const EnginerAdapter = require('./base');

class Express extends EnginerAdapter{
    constructor(driver) {
        super(driver);
        const bodyParser = require('body-parser');
        this._express = require('express');
        this.app = this._express();

        this.app.use(bodyParser.urlencoded());
        this.app.use(bodyParser.json());
    }

    createRoute(path, method, middlewares, callback) {
        this.app[method](path, middlewares, callback);
    }

    start() {
        this.app.listen(astronaut.config.port, astronaut.config.host, () => {
            console.log(`Express server up on <http://${astronaut.config.host}:${astronaut.config.port}/>`)
        });
    }
}

module.exports = Express;