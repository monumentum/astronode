const each = require('lodash/each');
const RestooseController = require('../../controller');

exports.getMethod = (controller, method) => {
    const controllerMethod = controller[method] || RestooseController[method];
    
    if (!controllerMethod) throw new Error('Missing method');
    return controllerMethod.bind(null, controller.Configuration.model);
};

exports.mountHandler = (controller, method, coreHandler) => (req, res) =>
    coreHandler(exports.getMethod(controller, method)(req), res);

exports.Attacher = (controller, app, coreHandler) => (uri, method, protocol) => {
    const handler = exports.mountHandler(controller, method, coreHandler);
    app[protocol](uri, handler);
};

exports.attachController = (server, controller) => {
    const basePath = `/${controller.Configuration.controllerName}`;
    const attacher = exports.Attacher(controller, server.app, server.opts.coreHandler);
    
    each(controller.Configuration.root, attacher.bind(null, `${basePath}/`));
    each(controller.Configuration.rootId, attacher.bind(null,`${basePath}/:id`));
};

exports.attachControllers = (server, controllers) => 
    each(controllers, exports.attachController.bind(null, server));