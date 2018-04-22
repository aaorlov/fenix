import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';

global.env = null;

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

Enzyme.configure({ adapter: new Adapter() });