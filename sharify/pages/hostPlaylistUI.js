import React, { Component } from 'react';
import { View} from 'react-native';
import { getValidSPObj} from "../spotifyAuth.js";
import{createAsHost} from "../firebaseHelper.js"
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import ShowPlaylists from "../src/components/ShowPlaylists.js"
import CreatePlaylistButton from "../src/components/CreatePlaylistButton.js"


export default class hostPage extends Component {
    static navigationOptions = {
        title: 'Host',
        headerStyle: {
            backgroundColor : '#070600',
            //backgroundColor : '#FCA311',
            
          },
          headerTintColor : 'white'
      };

    constructor(props) {
    super(props);

    //set default state for collaborative playlists
    this.state = {
            // TODO: tempVar is just to update user of completeness of items (should use objects to return promise notifications)
            "tempVar" : "Hey, user!",

            "name" : "Sharify's Auto-Generated Playlist",
            "description" : "Let's go team!",
            
            // Note: isPublic must be set to false for collaborative to work
            "isPublic":false,
            "isCollab":true,
            "playlist_id":"4GC3oUR910gclPtJUpReY9",
            "playlist_id2":"37i9dQZF1DX0IlCGIUGBsA",

            // Note: these must be URIs not just the songIDs
            "song1ToAdd":"spotify:track:29vPsCpO1i4DN2V5F9MSWi",
            "song2ToAdd":"spotify:track:0bjyNIHEPUEXGYFUoYqJni", 

            // Maximum number of contributions per member contributing to basic version of playlist generation 
            // Recommended: Playlist for enjoying old songs and playlist designed for discovering new music
            // Note: Must be 50 or less
            maxContributions : 5,

            // For calculations in favorite songs, what time period do we want to base off of? 
            // Options: long_term (several years), medium_term (last 6 months), short_term (last 4 weeks)
            // Note: We should have a slider for users to decide
            timeRange : "medium_term"

         }
    }

    

    render() {
        const config = {
            velocityThreshold: 0.2,
            directionalOffsetThreshold: 80
          };
          const {navigate} = this.props.navigation;
        
       return (
            
            <View style={{backgroundColor : "#1D1C17"}}>
                <GestureRecognizer
                onSwipeLeft={() => navigate("JoinPage")}
                config={config}
                >
                    
                    <View style={{height : '80%', marginBottom : 5}}>
                        <ShowPlaylists
                            hosted = {true}
                        />
                    </View>
                    <View style={{alignItems : 'center', height : '20%', width : '100%'}}>
                        <CreatePlaylistButton 
                            onPress = {this._generatePlaylist}
                            textStyle = {{
                                color:'white',
                                fontWeight: 'bold',
                                fontSize: 30,
                        
                            }}
                        />
                    </View>
                </GestureRecognizer>
            </View>
        );
    }

    onSwipeRight(gestureState) {
        const navigate = this.props.navigation;
        alert("Right Swipe!")
        navigate("JoinPage")
    }

    _getUserData = async () => {

        const sp = await getValidSPObj();
        const { id: userId } = await sp.getMe();     

        this.setState({
            "tempVar": "Data grabbed."
        }, () => {
        });

    };

    _resumePlayback = async () => {

        const sp = await getValidSPObj();
        const { id: userId } = await sp.getMe(); 
        
        sp.play()
        
                this.setState({
                    "tempVar": "Resuming Playback on Active Device."
                }, () => {
                });
        
            };


    _generatePlaylist = async () => {
        //TODO: Does commenting this line mean that playlist aren't created?
        //createNewPlaylist(this.state.name, this.state.description, this.state.isPublic)
        //newId = await createAsHost(this.state.name, this.state.description, this.state.isPublic)

        alert("Playlist " + this.state.name + " created!")
        const {navigate} = this.props.navigation
        //this.navigate.bind(this)
        navigate("CreatePage") //navigate to new page
        };

    _addToPlaylists = async () => {

        const sp = await getValidSPObj();
        const { id: userId } = await sp.getMe(); 

        var songs = [this.state.song1ToAdd, this.state.song2ToAdd]
        sp.addTracksToPlaylist(this.state.playlist_id, songs )
        
        this.setState({
            "tempVar": "The songs in the array were added."
        }, () => {
        });
            
}

    _addTopTracksToPlaylists = async () => {
    
        const sp = await getValidSPObj();
        const { id: userId } = await sp.getMe(); 

        songs = await sp.getMyTopTracks({"time_range" : this.state.timeRange});
        
        // this should loop through until the output is null or until the max number of songs desired is reached rather than
        // the current implementation of just brute searching
        var index;
        var songsParsed = []
        for (index = 0; index < this.state.maxContributions; index++) {
            songsParsed.push(songs.items[index].uri);
        }
        console.log(songsParsed)
        sp.addTracksToPlaylist(this.state.playlist_id, songsParsed);
        
        this.setState({
            "tempVar": "Your favorite songs have been added to the collab playlist.",
        }, () => {
        });
    
    }
}



