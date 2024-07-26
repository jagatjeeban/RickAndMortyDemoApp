import 'react-native';
import React from 'react';
import App from '../App';

//import render 
import { render } from '@testing-library/react-native';

// Note: import explicitly to use the types shipped with jest.
import {it} from '@jest/globals';

// Mocking react-native-flash-message
jest.mock('react-native-flash-message', () => 'FlashMessage');

// Mocking react-navigation stack navigator
jest.mock('../src/navigators', () => {
  return {
    __esModule: true,
    default: () => {
      return <></>;
    },
  };
});

it('app renders correctly', () => {
  const snapshot = render(<App/>).toJSON();
  expect(snapshot).toMatchSnapshot();
});
