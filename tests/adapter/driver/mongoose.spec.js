const MongooseAdapter = require('../../../src/adapter/driver/mongoose');

const expectOn = (call, index, method) =>
    expect(call.mock.calls[index][0]).toBe(method);

describe('src/adapter/driver/mongoose', () => {
    let adapter;

    const uri = 'test.com';
    const port = 1000;
    const database = 'test'
    const user = 'test_user';

    const fakeConnOn = jest.fn((name, cb) => cb());

    beforeEach(() => {
        adapter = new MongooseAdapter({ uri, port, database, user });
    });

    it('should start correctly', () => {
        expect(adapter).toHaveProperty('uri', `mongodb://${uri}:${port}/${database}`);
        expect(adapter).toHaveProperty('opts', { user });
    });

    it('exec start correctly', () => {
        adapter._registerModels = jest.fn();
        adapter.mongoose = {
            createConnection: jest.fn().mockReturnValue({
                on: fakeConnOn,
            }),
        };

        return adapter.start().then(() => {
            expectOn(fakeConnOn, 0, 'error');
            expectOn(fakeConnOn, 1, 'disconnected');
            expectOn(fakeConnOn, 2, 'connected');
            expect(adapter.mongoose.createConnection).toHaveBeenCalledWith(adapter.uri, adapter.opts);
        });
    });
});