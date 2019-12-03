import React from 'react';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export const startTimerInstance = (minutes) => {
    _runTimerTasks() //run once to start, then run every x minutes
    this.timer = setInterval(()=> _runTimerTasks(), minutes*60000)
}

const _runTimerTasks = () => {
    console.log("Timer Task was just run")
    //update geo-location of hosted playlists
    _getLocationAsync();
     //add songs from que's of hosted playlists
}

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
    return { latitude, longitude}

    }
    