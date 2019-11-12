import React from 'react';
import { testRec, getValidSPObj } from "./spotifyAuth.js";
import SpotifyWebAPI from 'spotify-web-api-js';


//////ALGORITHM LAYOUT://////
//      FUNCTION 1 (In: playlist id - Out: song id array)
// 1. take in playlist id and get list of songs
// 2. isolate last 5 songs from playlist

export const getLastFive = async(playlistID) => {
    //testid: 0zweTLBRy9bqPA6GUPTV1e
    const sp = await getValidSPObj();
    
    //get all songs as json object
    var playlistSongs = await sp.getPlaylistTracks(playlistID);
    var keys = Object.keys(playlistSongs)
    
    //isolate list of songs
    var songs = playlistSongs[keys[1]];
    var songKeys = Object.keys(songs)
    var count = songKeys.length;

    //final array of only the last 5 songs
    var finalArray = {};

    //isolate last 5
    if(count >=5){ //if there are more than five then take the last 5
        var slicedKeys = songKeys.slice(count-5, count);
        var songKeysCount = Object.keys(slicedKeys).length
    } else { //otherwise take whatever songs are present 
        slicedKeys = songKeys;
        songKeysCount = count;
    }

   
    //iterate through last 5 or fewer songs and add to final array
    for (i = 0; i < songKeysCount; i++) {
        console.log(songs[slicedKeys[i]].track.name);
        finalArray[i] = songs[slicedKeys[i]] //add to output
    }

    //return final five songs
    return finalArray;
}

//      FUNCTION 2 (In: song id array - Out: Json object of floats)
// 3. get average values of floats from 5 songs
export const avgValuesOfSongs = async(songArray) => {
    const sp = await getValidSPObj();
    let idArray = []

    var songArrayKeys = Object.keys(songArray)
    var count = songArrayKeys.length;

    for (let i = 0; i <count; i++){
        idArray[i] = songArray[i].track.id
    }
    let data = await sp.getAudioFeaturesForTracks(idArray);
   

    let avgs = {
     "acousticness": 0.0,
      "danceability": 0.0,
      "duration_ms": 0,
      "energy": 0.0,
      "instrumentalness": 0,
      "key": 0,
      "liveness": 0,
      "loudness": 0,
      "mode": 0,
      "speechiness": 0,
      "tempo": 0,
      "time_signature": 0,
      "valence": 0,
    }


    
  
  
    for (let songIndex = 0; songIndex < data.audio_features.length; songIndex++){
        console.log("Item: " + data.audio_features[songIndex]) //grabs each songs floats
        
        /*var dataKeys = Object.keys(data)
        var count = dataKeys.length;
        for (let valIndex = 0; valIndex <valCount; valIndex++){
            console.log(data[dataIndex].valkeys[valIndex])
        }*/

    }
    
}

//      FUNCTION 3 (In: firebase group id - Out: Json object of floats)
// 4. get average values of floats from each user
//      4a. iterate through users in group
//      4b. for each user, add value of each float to running sum and count users
//      4c. at the end, div floats by sum to get avgs

//      FUNCTION 5 (In: playlist Id, firebase group id - Out: success bool)
// 5. bring it all together. get 5 songs and avgs, plus avgs
//      from each user and feed into rec API call for final song
// 6. add song to playlist