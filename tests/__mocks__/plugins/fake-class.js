class Test {
    constructor() {
        this.isPluginClass = true;
        this._autoinitialize = jest.fn().mockReturnValue(Promise.resolve());
    }

    autoinitialize() {
        return this._autoinitialize();
    }
}

module.exports = Test;