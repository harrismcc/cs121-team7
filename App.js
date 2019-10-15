import React, { Component } from 'react';
import { View, Button, Image } from 'react-native';
import firebase from 'firebase';
import Header from './src/components/Header';
import LoginForm from './src/components/LoginForm';

// @Nick this is new1 ########################
import hash from "./hash";
import logo from "./logo.svg";
//import "./App.css"; //@Nick idk if we need this

import * as $ from "jquery";
//import Player from "./Player";

export const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = "2b9a23d90f084beeb0ad9a433ae5588f";
const client_secret = '56b063cc9bc14ffe999815b3e9f874e2'; // Your secret ID
const redirectUri = "http://localhost:3000";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
];

// @Nick end new1 ########################

export default class App extends Component {
  state = { loggedIn: null };
  
  // @Nick this new1.1 ########################
  constructor() {
    super();
    this.state = {
      token: null,
      item: {
        album: {
          images: [{ url: "" }]
        },
        name: "",
        artists: [{ name: "" }],
        duration_ms:0,
      },
      is_playing: "Paused",
      progress_ms: 0
    };
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
  }
  // @Nick this ends new1.1 ########################


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

    // @Nick this is new2 ########################
    let _token = hash.access_token;
    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
      // @Nick end new2 ########################

    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loggedIn: true })
      } else {
        this.setState({ loggedIn: false })
      }
    })
  }
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
  // @Nick this starts new1.2 ########################
  getCurrentlyPlaying(token) {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: (data) => {
        console.log("data", data);
        this.setState({
          item: data.item,
          is_playing: data.is_playing,
          progress_ms: data.progress_ms,
        });
      }
    });
  }
  // @Nick this ends new1.2 ########################
  render() {
    // render funciton
    return (
      <View>
        <Header title='Sharify' />
        {this.renderComponent()}
      <div className="App">
        <header className="App-header">
          <Image source ={require("logo.svg")} />
          //math for connecting to Spotify API
            {!this.state.token && (
              <a
                className="btn btn--loginApp-link"
                href={`${authEndpoint}client_id=${clientId}
                &redirect_uri=${redirectUri}&scope=${scopes.join("%20")}
                &response_type=token&show_dialog=true`}
              >
                Login to Spotify
              </a>
            )}
            {this.state.token && (
              // this is the spotify player
              <Player
                item={this.state.item}
                is_playing={this.state.is_playing}
                progress_ms={this.progress_ms}
              />
            )}
        </header>
      </div>
      </View>
    );
  }
}

