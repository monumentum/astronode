module.exports = (config = {}) => {
    return config.test ? config.test * 2 : 0;
}