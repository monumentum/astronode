exports.safeRequire = (path, message, ErrInstance) => {
    try {
        require.resolve(path);
        return require(path);
    } catch (e) {
        if (ErrInstance) throw new ErrInstance(message || e);
        throw new Error(message || e);
    }
};