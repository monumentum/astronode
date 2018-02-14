const Promise = require('bluebird');

const {
    writeFileAsync, readFileAsync, mkdirAsync
} = Promise.promisifyAll(require('fs'));

const route = moduleName => ({
    ['/' + moduleName] : {
        defaultAPI: {
            module: moduleName
        }
    }
});

const attachOnRouteFile = (moduleRoute, routeFile) => {
    readFileAsync(routeFile).then(value => {
        const routes = JSON.parse(value);
        const newRoutes = Object.assign(moduleRoute, routes);
        const newValue = JSON.stringify(newRoutes, null, 4);

        return writeFileAsync(routeFile, newValue);
    }).catch(() => {
        return writeFileAsync(routeFile, JSON.stringify(moduleRoute, null, 4));
    });
};

module.exports = moduleName => {
    const routeFile = `${process.cwd()}/astronode.routes.json`;
    const moduleRoute = route(moduleName);
    const moduleFolder = `app/${moduleName}`;

    Promise.all([
        mkdirAsync(moduleFolder),
        writeFileAsync(moduleFolder + '/model.js', 'module.exports = {}'),
        attachOnRouteFile(moduleRoute, routeFile)
    ]).then(() => {
        process.exit(0);
    });
};