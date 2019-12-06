import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ScrollView} from 'react-native';
import {getPlaylistFromId, getPlaylistImageURL} from "../firebaseHelper.js"
import {getPlaylistTracks} from "../spotifyAuth.js"
import firebase from 'firebase'


export default class DisplaySinglePlaylist extends Component {
    static navigationOptions = {
        title: "",
        headerStyle: {
            backgroundColor : '#070600',
            
          },
          headerTintColor : 'white',
          tabBarVisible : false,
      };
    constructor(props){
        super(props)
        this.state = {
            playlistId : null,
            playlistObject : {
                playlistSpotifyName : "Playlist",
                playlistDescription : ""
            },
            coverImage : "",
            test : "test",
        }
        console.disableYellowBox = true
        
    }

    componentDidMount(){
        this.setState({playlistId : this.props.navigation.getParam("playlistId", null)})
        this._storePlaylistInfoInState()
        this._refreshGuestList()
        
    }

    render(){
        return(
            <View style={styles.container}>

                <View style={{alignItems : 'center'}}>
                    <Image 
                        style = {{width : 200, height : 200}}
                        source = {{uri : this.state.coverImage}}
                    />
                    <Text style={styles.titleText}>{this.state.playlistObject.playlistSpotifyName}</Text>
                    <Text style={styles.mainText}>{this.state.playlistObject.playlistDescription}</Text>
                    <View style={{marginTop : 10}}>
                        <ScrollView style={{height : '30%'}}>
                            <FlatList
                                data = {this.state.guestList}
                                renderItem={({item}) => <Text style={styles.mainText}>{item}</Text>}
                            />
                        </ScrollView>
                    </View>
                </View>
            </View>
        )
    }

    _storePlaylistInfoInState = () => {

        
        //Non-async version of this code:
        playlist = ""
        if (this.state.playlistId){
            playlist = this.state.playlistId
        }else{
            playlist = this.props.navigation.getParam("playlistId", null)
        }
            
        getPlaylistFromId(playlist).then((playlist) => {
            this.setState({playlistObject : playlist})

            
            
        }).catch(err => {
            console.error("Error while setting playlist object in SinglePlaylist" + err)
        })
        
        getPlaylistImageURL(playlist).then((imageUrl) => {
            if (imageUrl != this.state.coverImage){
                this.setState({coverImage : imageUrl})
                this.setState({imageIsLoaded : true})
            }
            
            
        }).catch(err => {
            console.error("Error while setting cover image in SinglePlaylist" + err)
        })

        this._storeTracksInfoInState();

    }

    _refreshGuestList = () => {
        playlist = ""
        if (this.state.playlistId){
            playlist = this.state.playlistId
        }else{
            playlist = this.props.navigation.getParam("playlistId", null)
        }

            require('firebase/firestore');
            const ref = firebase.firestore().collection("playlists").doc(playlist);
            ref.get().then((doc) => {
                if (doc.exists && doc.data()["guests"] != this.state.guestList){
                    this.setState({guestList : doc.data()["guests"]})
                }
            })
        
        
        
    }

    _storeTracksInfoInState = () => {
        playlist = this.props.navigation.getParam("playlistId", null)
        
        getPlaylistTracks(playlist).then((tracks) => {
            console.log(JSON.stringify(tracks))
        })
        //hardcoded song title, for now
        
        
    }


    
}


const styles = StyleSheet.create({
    container: {
        width : '100%',
        height : '100%',
        backgroundColor : "#1D1C17",
    },
    titleText : {
        marginLeft : 5,
        color:'white',
        fontWeight: 'bold',
        fontSize: 50,
    },
    mainText : {
        color:'white',
        fontWeight: 'bold',
        fontSize: 20,

    },

});