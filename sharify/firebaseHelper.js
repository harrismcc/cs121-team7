import {firebaseConfig} from "./secrets.js"
import firebase from 'firebase'
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
        console.log("User ID: " + user.uid);
        const ref = firebase.firestore().collection(globalCollectionName);
        
        //check to see if user already exists
        getValueFromUserInDatabase(user).then((data) => {
            console.log(data)

            //if the data is undefined, the user is not in the db
                //and so we create a new value
            if(data == undefined){
                //create new doc for the user, and add default values
                ref.doc(user.uid).set({
                    test:'value'
                });
                return true;
            }else{
                return false;
            }
        });

            
}

//gets all fields from user doc as json
    //returns json object
export const getValueFromUserInDatabase = async(user) => {
    require('firebase/firestore');
        const ref = await firebase.firestore().collection(globalCollectionName);
        
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
        
        await ref.doc(user.uid).set({
            [key]: value
        }); 
}

export const logNewWorkoutInDatabase = async(user, workoutObject) =>{
    require('firebase/firestore');
    const ref = firebase.firestore().collection(globalCollectionName);
    
    //Increments coints (earn coins)
    const {coins} = await getValueFromUserInDatabase(user);
    newVal = parseInt(coins) + workoutObject.worth;
    console.log(newVal);
    await setValueFromUserInDatabase(user, 'coins', newVal.toString());

    //setValueFromUserInDatabase(user, 'coins', )
    await ref.doc(user.uid).collection('workouts').doc().set(workoutObject); 
    
}

export const getWorkoutsFromDatabase = async(user) => {
    require('firebase/firestore');
    const ref = await firebase.firestore().collection(globalCollectionName).doc(user.uid).collection('workouts').get();
    
    return ref.docs.map(doc => doc.data());
}