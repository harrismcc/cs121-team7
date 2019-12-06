import {firebaseConfig} from "./secrets.js"
import firebase from 'firebase'
import {createNewPlaylist, getValidSPObj} from "./spotifyAuth.js"
//THIS IS FROM ANOTHER APP BUT MIGHT BE USEFUL

//check if firebase app is already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    //firebase.analytics();
}


//globals here to set collection name across the board
const globalCollectionName = 'userCollection';

export const getCurrentUser = () => {

    return firebase.auth().currentUser
}


//adds user to userCollection for the first time. Won't add if user already exists
    //returns bool, true if user was created, false if user already exists
export const createNewUserInDatabase = (user) => {
        require('firebase/firestore');
        console.log("User ID: " + user.uid); //TODO: Delete this after testing is done
        const ref = firebase.firestore().collection(globalCollectionName);
        
        //check to see if user already exists
        getValueFromUserInDatabase(user).then((data) => {
            console.log(data)

            //if the data is undefined, the user is not in the db
                //and so we create a new value
            if(data == undefined){
                //create new doc for the user, and add default values
                ref.doc(user.uid).set({
                    test:'value' //temp test value
                });
                return true; //return true because user doesn't exist
            }else{
                return false; //return false because user already exists
            }
        });

            
    }

//gets all fields from user doc as json
    //returns json object
export const getValueFromUserInDatabase = async(user) => {
    require('firebase/firestore');
        if(user == null){
            user = getCurrentUser();
        }
        const ref = await firebase.firestore().collection(globalCollectionName);
        
        //grabs all data from user doc and returns as json
        return await ref.doc(user.uid).get().then((doc) => {
            return doc.data()
        })

        
}

//takes in a user and a key value pair, adding it to the user doc or
//modifying if key already exists
    //returns nothing
export const setValueFromUserInDatabase = async(user,key,value) => {
    require('firebase/firestore');
    const ref = firebase.firestore().collection(globalCollectionName);
        
    //adds new field WITHOUT overwriting all data
    await ref.doc(user.uid).set({
            [key]: value
        }, {merge: true});

    //ref.doc(user.uid).update({[key]: value}); <-- this might be a way to do the same thing?

}





/////////// BEGIN PLAYLIST SECTION //////////////////
const playlistCollectionName = 'playlists';


export const getPlaylistFromId = async(id) => {
    require('firebase/firestore');
    data = {}
    const ref = firebase.firestore().collection(playlistCollectionName).doc(id);
    await ref.get().then((doc) => {
        data = doc.data()
    }).catch((err) => {
        console.error("Error fetching playlist data: " + err)
    })

    return data;

}

export const getPlaylistImageURL = async(id) => {
    //chain this whole thing in .then statements
    playlistObject = await getPlaylistFromId(id).catch(err => {console.error(err)})
    const spotifyID = playlistObject.playlistSpotifyID
  

    return await getValidSPObj().then(sp => {
        return sp.getPlaylist(spotifyID).then(images => {
            const myImages = images["images"]
            console.log("My Images: " + JSON.stringify(myImages))

            if (myImages[0]) {
                return myImages[0]["url"]
            }else{
                return "https://images.rapgenius.com/0bfa0730f0f4251355f6311af8961917.1000x1000x1.jpg"
            }
            
    
        }).catch(err => {
            console.error("Error in getPlaylist in getPlaylistImageURL: " + err)
        });
    }).catch(err => {
        console.error("Error in getValidSPObj in getPlaylistImageURL: " + err)
    })



}
//this function creates a new playlist with the current user as host
export const createAsHost = async(playlistName, playlistDescription) => {
    require('firebase/firestore');

    //STEP 0: create playlits in spotify
    playlistId = await createNewPlaylist(playlistName, playlistDescription, true)

    //STEP 1: create new playlist object in collection 
    const ref = firebase.firestore().collection(playlistCollectionName);
    newId = "";

    test = await ref.add({
        playlistSpotifyID: playlistId,
        playlistSpotifyName : playlistName,
        playlistDescription : playlistDescription,
        playlistDateCreated: new Date(),
    }).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        newId = docRef.id
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

    //STEP 2: add user to that new objects 'host' collection
    userId = getCurrentUser().uid;
    ref.doc(newId).set({host : [userId]}, {merge: true})

    //STEP 3: add playlist id to users hosting collection
    hostingArray = await firebase.firestore().collection(globalCollectionName).doc(userId).get().then(
        function(doc){
            return doc.data()['hosting'];
        }
    ).catch(function(error) {console.error("Error getting document: " + error)});

    if (hostingArray == undefined){ //add new id to existing list of hosted id's
        hostingArray = [newId];
    }else{
        if (hostingArray.indexOf(newId) == -1){//prevents duplicates
            hostingArray.push(newId);
        }
        
    }   
    
    firebase.firestore().collection(globalCollectionName).doc(userId).set(
        {hosting : hostingArray}, {merge: true}
    )

    //STEP 4: create new playlist in spotify
    //TODO: complete step 4 with existing functions
}

//joins the current user as a guest to playlist 'playlistId'
export const joinAsGuest = async(playlistId) => {
    require('firebase/firestore');
    const ref = firebase.firestore().collection(playlistCollectionName);
    playlistDoc = ref.doc(playlistId);
    const userId = getCurrentUser().uid;

    

    //adds user as guest in playlist object, returs bool
    playlistDidExist = await playlistDoc.get().then(function(doc){
        if (doc.exists){
            
            guestsArray = doc.data()["guests"]
            if (guestsArray == undefined){ //add new id to existing list of hosted id's
                guestsArray = [userId];
            }else{
                if (guestsArray.indexOf(userId) == -1){ //prevents duplicates
                    guestsArray.push(userId);
                }
                
            }
            playlistDoc.set({guests : guestsArray}, {merge: true});//write new list to firebase
            return true;
        }else{
            console.log("Doc doesn't exist")
            return false;
        }
    }).catch(function(err) { //error handler
        console.log("Error when writing to playlists collection: " + err);
    });

    //add to user's guest list
    if (playlistDidExist){ 
        const ref = firebase.firestore().collection(globalCollectionName).doc(getCurrentUser().uid);
        await ref.get().then(function(doc){
            guestList = doc.data()["guest"]
            console.log(doc.data()[["guest"]])
            
            if (guestList == undefined){
                guestList = [playlistId];
            }else{
                console.log("Something Exists")
                if (guestList.indexOf(playlistId) == -1){ //prevents duplicates
                    console.log("Pushed")
                    guestList.push(playlistId);
                }
                
            }
            console.log("About to write to fb")
            ref.set({guest: guestList}, {merge: true}); //write new list to firebase
        }).catch(function(err) { //error handler
            console.error("Error when writing to userCollection: " + err)
        });
        
        
    }

    //return the playlist object
    return playlistDoc
   
}

export const updateLocationInFirebase = (lat, long) => {
    require('firebase/firestore');
    const geoPoint = new firebase.firestore.GeoPoint(lat, long);
    console.log("Logging User Location ")
    setValueFromUserInDatabase(getCurrentUser(), "location", geoPoint);

}

