import React, { Component } from 'react';
import { View, Button, Text } from 'react-native';
import firebase from 'firebase';
import {styles} from '../stylesheet.js'
import LoginForm from '../src/components/LoginForm';
import {firebaseConfig} from '../secrets.js'

export class LoginFormPage extends Component {
  static navigationOptions = {
    title: 'Welcome!',
  };
  state = { loggedIn: null };

  // note: do not add real config info till launch (one app is secured and in closed repository)
  componentDidMount() {

    let config = firebaseConfig;

    //check if firebase app is already initialized
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loggedIn: true })
      } else {
        this.setState({ loggedIn: false })
      }
    })
  }

  renderComponent() {
    if (this.state.loggedIn) {
      return (<Button
        title="Log out"
        onPress={() => firebase.auth().signOut()} />)
    } else {
      return (
        <LoginForm />
      )
    }
  }
  render() {
    return (
        <View style={{width: 300, flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center'}}>
            {this.renderComponent()}
        </View>
    );
  }
}