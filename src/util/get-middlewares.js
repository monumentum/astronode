module.exports = middlewares => {
    return middlewares.map(m => astronode.middlewares[m]);
};
