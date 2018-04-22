import React from 'react';
import { node } from 'prop-types';

/**
 * Main container
 * */
const AppContainer = ({ children }) => (
  <div styleName="app-container">
    { children }
  </div>
);

AppContainer.propTypes = {
  children: node
};

AppContainer.defaultProps = {
  children: undefined
};

export default AppContainer;
