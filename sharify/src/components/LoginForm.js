import React, { Component } from 'react';
import { View, Button, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import firebase from 'firebase';
import Input from './Input';
//import {styles} from "../../stylesheet.js"

var amountOfTries = 0
var spotifyToken = "694579933"

// Define variables to update in order to reference and display in GUI
export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '' };
  }

  login() {
    this.setState({ error: '', loadingA: true })
    const { email, password } = this.state;
    // Submit login information to the Firebase database to try to find user
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(this.onLoginSuccess.bind(this))
      
          // If there is an error print error message
          .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            if (errorCode == 'auth/invalid-email') {
              this.onLoginFailure.bind(this)('Please enter a valid email.')
            }
            else if (errorCode == 'auth/wrong-password') {
              this.onLoginFailure.bind(this)('Incorrect password attempt. Please try again.')
              // make sure there aren't too many invalid attempts: offer reset
              amountOfTries++;
              if (amountOfTries > 1) {
                this.onLoginFailure.bind(this)('Looks like you forgot your password...')
              }

            }
            else if (errorCode == 'auth/user-not-found') {
              this.onLoginFailure.bind(this)('We couldn\'t find an account with that email.')
            } 
            else {
              this.onLoginFailure.bind(this)(errorMessage)
            }
          });
  }

  // adds users to database along with their Spotify token
  writeUserData(email,spotifyToken){
    firebase.database().ref(databaseURL).push({
        email,
        spotifyToken
    }).then((data)=>{
        //success callback
        console.log('data ' , data)
    }).catch((error)=>{
        //error callback
        console.log('error ' , error)
    })
}

// makes account
  createAccount() {
    this.setState({ error: '', loadingB: true })
    const { email, password } = this.state;
    // Submit login information to the Firebase database to create new user
    // Check to make sure that they don't already have an account
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(this.onLoginSuccess.bind(this))
          // If there is an error print error message
          .catch((error) => {
            let errorCode = error.code
            let errorMessage = error.message;
            if (errorCode == 'auth/email-already-in-use') {
              this.onLoginFailure.bind(this)('You already have an account. Try logging in.')
            }
            else if (errorCode == 'auth/invalid-email') {
              this.onLoginFailure.bind(this)('Please enter a valid email.')
            }
            else if (errorCode == 'auth/weak-password') {
              this.onLoginFailure.bind(this)('Password must be greater than 5 characters.')
            }
            else {
            this.onLoginFailure.bind(this)(errorCode)
          }
          });

          this.writeUserData.bind(email,spotifyToken)
      
  }

  // sends reset password link
  resetAccount() {
    var errorFound = 0
    this.setState({ error: '', loadingB: true })
    const { email, password } = this.state;
    // Submit login information to the Firebase database to create new user
    // Check to make sure that they don't already have an account
        firebase.auth().sendPasswordResetEmail(email)
          .then(this.onLoginSuccess.bind(this))
          // If there is an error print error message
          .catch((error) => {
            let errorCode = error.code
            let errorMessage = error.message;
            errorFound = 1
            if (errorCode == 'auth/email-already-in-use') {
              this.onLoginFailure.bind(this)('You already have an account. Try logging in.')
            }
            else if (errorCode == 'auth/invalid-email') {
              this.onLoginFailure.bind(this)('Please enter a valid email.')
            }
            else if (errorCode == 'auth/weak-password') {
              this.onLoginFailure.bind(this)('Password must be greater than 5 characters.')
            }
            else {
            this.onLoginFailure.bind(this)(errorCode)
          }
          }
        );
        if (errorFound == 0) {
          this.onLoginFailure.bind(this)('Check your email to reset your password.')
          errorFound = 0
      }
        }
          
  // Update variable to move us to the home screen
  onLoginSuccess() {
    this.setState({
      email: '', password: '', error: '', loadingA: false, loadingB: false
    })
  }

  // Stop loading screen and print error
  onLoginFailure(errorMessage) {
    this.setState({ error: errorMessage, loadingA: false, loadingB: false })
  }

  // Display button and search for presses
  renderButton() {
    if (this.state.loadingA) {
      return (
        <View style={styles.spinnerStyle}>
          <ActivityIndicator size={"small"} />
        </View>
      )
    } else {
      return (
        <Button
          title="Log In"
          onPress={this.login.bind(this)}
        />
      )
    }
  }

  // Display button and search for presses
  renderButton2() {
    if (this.state.loadingB) {
      return (
        <View style={styles.spinnerStyle}>
          <ActivityIndicator size={"small"} />
        </View>
      )
    } else {
      return (
        <Button
          type = "outline"
          title="Create Account"
          onPress={this.createAccount.bind(this)}
        />
      )
    }
  }

  // Pops up if a user may need to reset their password
  renderButton3() {
    if (this.state.loadingB) {
      return (
        <View style={styles.spinnerStyle}>
          <ActivityIndicator size={"small"} />
        </View>
      )
    } else {
      return (
        <Button
          div id = "Reset"
          type = "outline"
          title="Reset Password"
          onPress={this.resetAccount.bind(this)}
        />
      )
    }};

  render() {
    return (
      <View>
        <Input label="Email"
          placeholder="colleen@CS.com"
          value={this.state.email}
          secureTextEntry={false}
          onChangeText={email => this.setState({ email })} />

        <Input label="Password"
          placeholder="team123"
          value={this.state.password}
          secureTextEntry={true}
          onChangeText={password => this.setState({ password })} />

        {this.renderButton()}
        {this.renderButton2()}
        {this.renderButton3()}
        
        <Text style={styles.errorTextStyle}>
          {this.state.error}
        </Text>
      </View>
    )
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 16,
    alignSelf: 'center',
    color: 'red'
  },
  bottomView:{
    width: '0%', 
    height: 300, 
    backgroundColor: '#FF9800', 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'absolute',
    bottom: 0
  },
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  createButtonStyle: {
      position: 'absolute',
      bottom:0,
      left:0,
  }
}