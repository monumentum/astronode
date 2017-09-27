jest.mock('../../controller', function () {
    let original = require.requireActual('../../controller');

    return Object.assign(original, {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    });
});

jest.mock('mongoose', () =>{
    let original = require.requireActual('mongoose');

    return Object.assign(original, {
        model: jest.fn()
    });
});


const controller = require.requireMock('../../controller');
const { attachControllers, getMethod } = require('./');

describe('(restoose/utils) attachControllers', () => {
    let serverFake;

    beforeEach(() => {
        serverFake = {
            app: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
            opts: { coreHandler: jest.fn() }
        };
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it('should call attachController correct times', () => {
        const FAKE_NAMESPACE_1 = 'test_1';
        const FAKE_NAMESPACE_2 = 'test_2';

        attachControllers(serverFake, [
            {Configuration: controller.NewController(FAKE_NAMESPACE_1)},
            {Configuration: controller.NewController(FAKE_NAMESPACE_2)},
        ]);
        
        expect(serverFake.app.get).toHaveBeenCalledTimes(4);
        expect(serverFake.app.post).toHaveBeenCalledTimes(2);
        expect(serverFake.app.put).toHaveBeenCalledTimes(2);
        expect(serverFake.app.delete).toHaveBeenCalledTimes(2);
    });
    
    describe('#getMethod', () => {
        let fakeController;
        
        beforeEach(() => {
            fakeController = {Configuration: controller.NewController('test')};
        });
        
        it('should get correct method when controller has the method', () => {
            getMethod(fakeController, 'find')();
            expect(controller.find).toHaveBeenCalledTimes(1);
        });
        
        it('should get default method when controller comes without method', () => {
            fakeController.find = jest.fn();
            getMethod(fakeController, 'find')();
            
            expect(fakeController.find).toHaveBeenCalledTimes(1);
            expect(controller.find).toHaveBeenCalledTimes(0);
        });
        
        it('should throw exception when method aren\'t in any object', () => {
            expect(() => getMethod(fakeController, 'xxxxx')).toThrow();
        });
    });
});