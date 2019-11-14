import {firebaseConfig} from "./secrets.js"
import firebase from 'firebase'
//THIS IS FROM ANOTHER APP BUT MIGHT BE USEFUL

//check if firebase app is already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    //firebase.analytics();
}

export const getCurrentUser = () => {
    return firebase.auth().currentUser
}
export const createNewUserInDatabase = (user) => {
    
        require('firebase/firestore');
        console.log("User ID: " + user.uid);
        const ref = firebase.firestore().collection('userCollection');
        
        ref.doc(user.uid).set({
            coins: '0',
            workouts : {}
        });     


        
  
}

export const getValueFromUserInDatabase = async(user) => {
    require('firebase/firestore');
        const ref = await firebase.firestore().collection('userCollection');
        
       return await ref.doc(user.uid).get().then((doc) => {
            return doc.data()
        })
        
    

        
}

export const setValueFromUserInDatabase = async(user,key,value) => {
    require('firebase/firestore');
        const ref = firebase.firestore().collection('userCollection');
        
        await ref.doc(user.uid).set({
            [key]: value
        }); 
}

export const logNewWorkoutInDatabase = async(user, workoutObject) =>{
    require('firebase/firestore');
    const ref = firebase.firestore().collection('userCollection');
    
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
    const ref = await firebase.firestore().collection('userCollection').doc(user.uid).collection('workouts').get();
    
    return ref.docs.map(doc => doc.data());
}