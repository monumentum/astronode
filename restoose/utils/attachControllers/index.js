const each = require('lodash/each');
const has = require('lodash/has');
const RestooseController = require('../../controller');

const getMethod = (controller, method) => {
    const controllerMethod = controller[method] || RestooseController[method];
    
    if (!controllerMethod) throw new Error('Missing method');
    return controllerMethod.bind(null, controller.Configuration.model);
}

const Attacher = (controller, app, handler) => uri => (method, protocol) => {
                        return app[protocol](uri, (req, res) => 
                                handler(getMethod(controller, method)(req), res));
}

const attachController = exports.attachController = (server, controller) => {
    const basePath = `/${controller.Configuration.controllerName}`;
    const attacher = Attacher(controller, server.app, server.opts.coreHandler);
    
    each(controller.Configuration.root, attacher(`${basePath}/`));
    each(controller.Configuration.rootId, attacher(`${basePath}/:id`));
}

exports.attachControllers = (server, controllers) => 
            each(controllers, attachController.bind(null, server));