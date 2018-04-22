import React from 'react';
import test from 'ava';
import {shallow} from 'enzyme';
import HelloMessage from './hello-message';


test('HelloMessage should render with name text', async() => {
  const name = 'name';
  const wrapper = shallow(<HelloMessage name={name}/>);

  wrapper.text().should.to.be.equal(name);

});

