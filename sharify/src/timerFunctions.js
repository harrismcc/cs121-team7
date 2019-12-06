import React from 'react';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import {updateLocationInFirebase, setValueFromUserInDatabase, getCurrentUser} from '../firebaseHelper'
import {getUserFloats} from "../../iterRec.js"

export const startTimerInstance = (minutes) => {
    //only run timer functions if user is logged in
    if (getCurrentUser()){
        _runTimerTasks() //run once to start, then run every x minutes
        this.timer = setInterval(()=> _runTimerTasks(), minutes*60000)
    }
}

const _runTimerTasks = () => {
    console.log("Timer Task was just run")
    //update geo-location of hosted playlists
    _getLocationAsync();
     //add songs from que's of hosted playlists

     //update users spotify preferences in database
     getUserFloats().then((myFloats) => {
        user = getCurrentUser()
        if(user){
            setValueFromUserInDatabase(user, spotifyFloats, myFloats)
        }
        
     })
}


//function to get user location, also stores it in firebase
const _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
        console.log('Permission to access location was denied');
        latitude = 0
        longitude = 0
    }else{
        let location = await Location.getCurrentPositionAsync({});
        latitude = location['coords']['latitude']
        longitude = location['coords']['longitude']
    };
    //point = new firebase.firestore.GeoPoint(latitude, longitude)
    updateLocationInFirebase(latitude, longitude)
    return { latitude, longitude}

    }
    