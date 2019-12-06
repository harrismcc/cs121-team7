import React from 'react';
import { Text, View, Button, ScrollView, Image, TouchableOpacity, ImageBackground } from 'react-native';
import * as Permissions from 'expo-permissions';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

// This page also has the buttons to navigate to other pages

//StyleSheet
import {styles} from './stylesheet.js'

//This page is the main page that shows the lists of playlist names
export class MainScreen extends React.Component {
  state = { loggedIn: null };
  
  
    static navigationOptions = {
      title: 'Sharify',
      backgroundColor: "#555555",
    };
  
   constructor(props) {
    super(props);
     
    //set default state
    this.state = {
      result: null,
    };
   }
   
   render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <ImageBackground 
          style={styles.buttonImage}
          source={require('./assets/green_button.png')}
          onPress={() => navigate('HostPage')}
        >
            <View style={styles.hostButton}>
              <Button title = "Host" color = "black" onPress={() => navigate('HostPage')}/>
            </View>
        </ImageBackground>
        <ImageBackground 
          style={styles.buttonImage2}
          source={require('./assets/green_button.png')}
          onPress={() => navigate('HostPage')}
        >
            <View style={styles.joinButton}>
              <Button title = "Join" color = "black" onPress={() => navigate('JoinPage')}/>
            </View>
        </ImageBackground>
        <View style={styles.submitButton}>
              <Button title = "Log in" color = "white" onPress={() => navigate('LoginPage')}/>
            </View>
      </View>
    );
  }
  
  renderComponent() {
    if (this.state.loggedIn) {
      return ("Log out")
    } else {
      return ("Log out")
    }
  }

    qrnavigation = async() => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      
      if (status == 'granted'){
        return true
      }else{
        console.log("NO CAMERA ACCESS")
        return false
      }
    }
      
    
  }