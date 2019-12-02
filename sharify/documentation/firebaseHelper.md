# firebaseHelper.js Documentation

## Firestore Structure
In order to understand these functions, it's important to understand the structure of the firestore tables. There are two main collections. The userCollection has a unique document for each user with individual user data, the playlists collection has a unique document for each playlist created on out platform.

### Example User
![Example User](https://i.imgur.com/WiRW72K.png)
Here is an example of a typical user in the database. There are a few different fields to note.

Name | Type | Description
--- | --- | ---
**guest** | `array` | an array of all playlist id's in which the user is joined as a guest  
**hosting** | `array` | and array of all playlist id's in which the user is the host  
**spotifyToken** | `string` | the users spotify API token  
**spotifyUserId** | `string` |the users spotify user ID  

### Example Playlist
![Example Playlist](https://i.imgur.com/71Q3FQi.png)
This is an example of a typical playlist in the database.   

Name | Type | Description
--- | --- | ---
**guests** | `array` | an array of all users who are guests on this playlist  
**host** | `array` | a SINGLE ITEM array containing the id of the host  
**name** | `string` | the playlist name  
**playlistDateCreated** | `datetime` | the date & time the playlist was created  
**playlistSpotifyID** | `string` | the id of the playlist in spotify  

## Function Reference

### createNewUserInDatabase(name)

**Overview:** This function adds user to userCollection for the first time. Won't add if user already exists.  
**Inputs:**  

Name | Type | Description
--- | --- | ---
user | `Firebase-auth user object` | The user to be added  

**Outputs:**  `Boolean` Success, will return false if user already exists  
