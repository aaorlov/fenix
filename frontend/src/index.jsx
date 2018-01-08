import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './assets/styles/index.scss';

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
