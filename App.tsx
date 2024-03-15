import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import PushNotification from 'react-native-push-notification';
import { navigationRef } from './src/navigation/NavigationService';
import * as RootNavigation from './src/navigation/NavigationService';

const navTheme = DefaultTheme;
navTheme.colors.background = 'transparent';
function App() {

  async function requestUserPermission() {
    console.log('requesting permission');
    const authStatus = await messaging().requestPermission();
    console.log('requesting permission');
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      console.log('enabled status:', enabled);
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  PushNotification.createChannel(
    {
      channelId: "default-channel-id", // replace with your channel id
      channelName: "Your Channel Name", // replace with your channel name
      channelDescription: "A channel to categorise your notifications", // optional description
      soundName: "default", // optional. See `soundName` parameter of `localNotification` function
      importance: 4, // optional. See `importance` parameter of `createChannel`. Default is 4
      vibrate: true, // optional. Default is true.
    },
    (created) => console.log(`CreateChannel returned '${created}'`) // optional callback returns whether the channel was created or already existed.
  );
    
  const getToken = async() => {
    console.log("token1");
      const token = await messaging().getToken();
      console.log("token");
      console.log(token);
    }

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      // Add your background message handling logic here
    });

  useEffect(() => {
    requestUserPermission();
    getToken();
  },[])

  PushNotification.configure({
    onNotification: function (notification) {
      console.log('Notification clicked', notification);
      // Directly access `shortcutId` from the notification
      const quizId = notification.shortcutId;
      console.log("quizId:", quizId);
      if (quizId) { // Check if `quizId` is truthy. This means it exists and is not null, undefined, or an empty string
        // Navigate to the 'QuizPageScreen' with `quizId`
        RootNavigation.navigate('QuizPageScreen', {
          quizId: quizId
        });
      }
    },
    // Other configuration options...
});

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
  
      PushNotification.localNotification({
        channelId: "default-channel-id", // Ensure this matches the channel ID used in createChannel
        title: remoteMessage.notification?.title || "Default Title", // Use actual title or a default
        message: remoteMessage.notification?.body || "Default message",
        shortcutId: remoteMessage.data?.questionid.toString(), // Add any custom data to the notification
      });
    });
  
    return unsubscribe;
  }, []);
  
  return (
    <NavigationContainer theme={navTheme} ref={navigationRef}><AppNavigator /></NavigationContainer>
  );

}

export default App;