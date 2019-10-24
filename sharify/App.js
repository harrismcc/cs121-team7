import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
//tutorial: https://medium.com/@zachrach/spotify-web-api-authorization-with-react-native-expo-6ee1a290b2b0

//Get Redirect URI
import {AuthSession} from 'expo'
console.log(AuthSession.getRedirectUrl())
//gives me the URI:
//https://auth.expo.io/@harrismcc/Authenticator


export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
