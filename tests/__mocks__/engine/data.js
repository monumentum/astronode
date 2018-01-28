const fakeReturn = 'METHOD_RESPONSE';
module.exports = {
    fakeReturn,
    methods: {
        find: jest.fn().mockReturnValue(fakeReturn),
        findById: jest.fn().mockReturnValue(fakeReturn),
        update: jest.fn().mockReturnValue(fakeReturn),
        delete: jest.fn().mockReturnValue(fakeReturn),
        create: jest.fn().mockReturnValue(fakeReturn),
    }
}