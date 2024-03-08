import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

const Background = ({ children }) => (
  <ImageBackground source={require('../assets/images/homePageLogo.jpg')} style={styles.background}>
    {children}
  </ImageBackground>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default Background;