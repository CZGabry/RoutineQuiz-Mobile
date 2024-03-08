import React from 'react';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

const navTheme = DefaultTheme;
navTheme.colors.background = 'transparent';
function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default App;