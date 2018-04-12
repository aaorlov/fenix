import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Example from './assets/json/example.json';
import './assets/styles/index.scss';
import num from './components/test';


console.log(Example, num);
/** app */
const HelloMessage = props => (
  <div>
    Hello {props.name}
  </div>
);

HelloMessage.propTypes = {
  name: PropTypes.string.isRequired
};

ReactDOM.render(
  <HelloMessage name='Taylor' />,
  document.getElementById('root')
);
