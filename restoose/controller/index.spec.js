jest.mock('mongoose', () =>{
    let original = require.requireActual('mongoose');

    return Object.assign(original, {
        model: jest.fn()
    });
});

const mongoose = require.requireMock('mongoose');
const RestooseController = require('./');

describe('(restoose/controller) Index', () => {
    const controllerModel = 'Test';
    const controllerName = controllerModel.toLowerCase();
    let rootProps, rootIdProps;
    
    beforeEach(() => {
        rootProps = {'get': 'find', 'post': 'create'};
        rootIdProps = {'get': 'findOne', 'put': 'update', 'delete': 'delete'};
    });
    
    afterEach(() => {
       mongoose.model.mockReset();
    });
    
    it('should init a controller', () => {
        const controller = RestooseController.NewController(controllerModel);
        const $controller = expect(controller);
        
        $controller.toHaveProperty('controllerName', controllerName);
        $controller.toHaveProperty('root', rootProps);
        $controller.toHaveProperty('rootId', rootIdProps);
        expect(mongoose.model).toHaveBeenCalledWith(controllerModel);
    });
    
    describe('internal methods', () => {
        let req = { body: 'TEST_BODY', query: 'TEST_QUERY', params: { id: 'TEST_ID' } };
        let model = {
            find: jest.fn(), 
            findOne: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
        };
    
        it('should call find with correct params', () => {
            RestooseController.find(model, req);
            expect(model.find).toHaveBeenCalledWith(req.query);
        });
        
        it('should call findOne with correct params', () => {
            RestooseController.findOne(model, req);
            expect(model.findOne).toHaveBeenCalledWith(req.params.id);
        });  
        
        it('should call update with correct params', () => {
            RestooseController.update(model, req);
            expect(model.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, req.body);
        });
        
        it('should call delete with correct params', () => {
            RestooseController.delete(model, req);
            expect(model.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
        });  
    });
});