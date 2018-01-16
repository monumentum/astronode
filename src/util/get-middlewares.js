module.exports = middlewares => {
    return middlewares.map(m => astronaut.middlewares[m]);
};
