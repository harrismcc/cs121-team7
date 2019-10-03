import React, { Component } from 'react';
import { View, Button } from 'react-native';
import firebase from 'firebase';
import Header from './src/components/Header';
import LoginForm from './src/components/LoginForm';

export default class App extends Component {
  state = { loggedIn: null };

  // note: do not add real config info till launch (one app is secured and in closed repository)
  componentDidMount() {
    let config = {
      apiKey: "AIzaSyDvk0jhmBxYZ-zKlnH-AjlwRD_ncC5J8fI",
      authDomain: "sharify-1320a.firebaseapp.com",
      databaseURL: "https://sharify-1320a.firebaseio.com",
      projectId: "sharify-1320a",
      storageBucket: "sharify-1320a.appspot.com",
      messagingSenderId: "846116937918",
      appId: "1:846116937918:web:0076be3f93e8af5703feef",
      measurementId: "G-M00PCR1CB5"
    };

    firebase.initializeApp(config);
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
      <View>
        <Header title='Sharify' />
        {this.renderComponent()}
      </View>
    );
  }
}