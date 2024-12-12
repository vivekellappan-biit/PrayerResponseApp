import React from 'react';
import ApplicationNavigator from './navigation/ApplicationNavigator';
import {COLORS} from './constants/colors';
import {StatusBar} from 'react-native';

export default function App() {
  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <ApplicationNavigator />
    </>
  );
}
