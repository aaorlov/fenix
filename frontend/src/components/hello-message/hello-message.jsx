import React from 'react';
import PropTypes from 'prop-types';

const HelloMessage = props => (
  <div>
    {props.name}
  </div>
);

HelloMessage.propTypes = {
  name: PropTypes.string.isRequired
};

export default HelloMessage;