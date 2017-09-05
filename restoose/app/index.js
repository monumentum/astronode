const loadModules = require('../utils/loadModules');

class Restoose {
    constructor(library, opts) {
        this.app = library();
        this.opts = opts;
    }

    loadModules(basePath, opts) {
        this.__loadModules__ = loadModules(basePath, opts);
    }

    init() {
        this.__loadModules__().then((result) => {
            this.app.listen(this.opts.hostname, this.opts.port, () => {
                console.log('Server init');
            });
        });
    }
}