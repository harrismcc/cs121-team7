import React, { Component } from 'react';
import { View, Button, Text } from 'react-native';
import firebase from 'firebase';
import { styles } from '../stylesheet.js'
import { createNewPlaylist, getValidSPObj } from "../spotifyAuth.js";

export default class hostPage extends Component {
    static navigationOptions = {
        title: 'Host Page',
      };

    constructor(props) {
    super(props);

    //set default state for collaborative playlists
    this.state = {
            "tempVar" : "Hey, user!",
            "name" : "Sharify Generated Playlist",
            "description" : "What's up everybody, Beau here with another minecraft tutorial",
            "public" : false,
            "collaborative": true
         }

    this.state2 = {
        "name" : "Sharify Generated Playlist",
        "description" : "What's up everybody, Beau here with another minecraft tutorial",
        "public" : false,
        "collaborative": true
    }
}

    render() {
        return (
            <View style = {{ flex: 1, justifyContent: "center",
            alignItems: "center"}}>
            <Text>{this.state.tempVar}</Text>
            <Button title="Make Default Collab Playlist" onPress={this._getUserData} />
            </View>
        );
    }

    errorOutput(obj, obj2) {
        this.setState({
            "tempVar": obj
        })
    }

    _getUserData = async () => {

        this.setState({
            "tempVar": "The button was clicked"
        }, () => {
        });

        const sp = await getValidSPObj();

        this.setState({
            "tempVar": "yay"
        }, () => {
        });

        const { id: userId } = await sp.getMe();     

        this.setState({
            "tempVar": "oh no"
        }, () => {
        });

        

        this.setState({
            "tempVar": "oh yeah"
        }, () => {
        });

        sp.play()

        this.setState({
            "tempVar": "oh h"
        }, () => {
        });
        
        sp.followPlaylist(this.state2.playlist_id, {public:false});
        sp.createPlaylist(id, {"name" : "Hey Bog"});    

        this.setState({
            "tempVar": "weeee"
        }, () => {
        });

        

        this.setState({
            "tempVar": "If you're reading this, it worked!"
        }, () => {
        });

    };
}



