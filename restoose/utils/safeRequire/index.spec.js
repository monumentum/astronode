const FAKE_PREFIX = 'FAKE_PREFIX';
const { safeRequire } = require('./');
const throwedSafeRequire = (m, i) => () => safeRequire('testFile', m, i);
const expectedError = /Cannot find module 'testFile' from 'index.js'/;

class MyErr extends Error {
    constructor(message) {
        super(FAKE_PREFIX, message);
        Error.captureStackTrace(this, MyErr);
    }
}

describe('(restoose/utils) safeRequire', () => {
    it('should throw err with default instance and default message', () => {
        expect(throwedSafeRequire()).toThrow(expectedError);
    });
    
    it('should throw err with default instance and custom message', () => {
        const fakeMessage = 'FAKE_MESSAGE';
        expect(throwedSafeRequire(fakeMessage)).toThrow(fakeMessage);
    });
    
    it('should throw err with custom instance and default message', () => {
        expect(throwedSafeRequire(null, MyErr)).toThrow(MyErr);
    });
    
    it('should throw err with custom instance and custom message', () => {
        const fakeMessage = 'FAKE_MESSAGE';
        expect(throwedSafeRequire(fakeMessage, MyErr)).toThrow(MyErr);
    });
    
    it('should successfuly require the file', () => {
        expect(() => safeRequire('./')).not.toThrow(expectedError);
    });
})