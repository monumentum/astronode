const main = require('../');

module.exports = cmd =>
    main.runAstronode(cmd)
        .then(main.runServerFunction)
        .then(main.initServer);