import React from 'react';
import { Route } from 'react-router-dom';
import nanoid from 'nanoid';

import AppContainer from '../components/app';

/**
 * Generate routers by config
 * */
export default function listOfRoutesFrom(config) {
  return config.map(route => {
    const { component: Component, componentProps, ...rest } = route;

    return (
      <Route
        key={nanoid(6)}
        component={routeProps => (
          <AppContainer>
            <Component {...componentProps} {...routeProps} />
          </AppContainer>
        )}
        {...rest} />
    );
  });
}
