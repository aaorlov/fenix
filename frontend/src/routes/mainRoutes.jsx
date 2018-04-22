import listOfRoutesFrom from './routeHelpers';
import TestContainer from '../components/test';

const mainRoutesConfig = [
  {
    exact: true,
    path: '/',
    component: TestContainer,
    componentProps: {}
  }
];

export default listOfRoutesFrom(mainRoutesConfig);
