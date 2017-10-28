import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;
chai.use(chaiAsPromised);

global.chai = chai;