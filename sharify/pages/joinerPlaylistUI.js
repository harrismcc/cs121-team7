import React, { Component } from 'react';
import { View, Button, Text } from 'react-native';
import firebase from 'firebase';
import {styles} from '../stylesheet.js'

export default class joinerPage extends Component {
    static navigationOptions = {
        title: 'Join Page',
      };

    // Hard-coded song data to be changed to play any song
    constructor(props) {
        super(props);
    this.state = {
        currentSong : "Despacito",
        currentSongID : "6rPO02ozF3bM7NnOV4h6s2"
    };
}
    render() {
        return (
            <View style = {{ flex: 1, justifyContent: "center",
            alignItems: "center"}}>
            <Text>Welcome, Guest. </Text>
            </View>
        );
    }
}