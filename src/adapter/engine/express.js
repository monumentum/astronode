const EnginerAdapter = require('./base');

class Express extends EnginerAdapter{
    constructor(driver) {
        super(driver);
        const bodyParser = require('body-parser');
        this._express = require('express');
        this.app = this._express();

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
    }

    createRoute(path, method, middlewares, callback) {
        this.app[method](path, middlewares, callback);
    }

    start() {
        this.app.listen(astronode.config.port, astronode.config.host, () => {
            console.log(`Express server up on <http://${astronode.config.host}:${astronode.config.port}/>`);
        });
    }
}

module.exports = Express;