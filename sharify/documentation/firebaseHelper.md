# firebaseHelper.js Documentation

## Firestore Structure
In order to understand these functions, it's important to understand the structure of the firestore tables. There are two main collections. The userCollection has a unique document for each user with individual user data, the playlists collection has a unique document for each playlist created on out platform.

### Example User
![Example User](https://i.imgur.com/WiRW72K.png)
Here is an example of a typical user in the database. There are a few different fields to note.

**guest**: an array of all playlist id's in which the user is joined as a guest
**hosting**: and array of all playlist id's in which the user is the host
**spotifyToken**: the users spotify API token
**spotifyUserId**: the users spotify user ID

### Example Playlist
![Example Playlist](https://i.imgur.com/71Q3FQi.png)
This is an example of a typical playlist in the database. 

**guests:** an array of all users who are guests on this playlist
**host:** a SINGLE ITEM array containing the id of the host
**name:** the playlist name
**playlistDateCreated:** the date & time the playlist was created
**playlistSpotifyID:** the id of the playlist in spotify

## Function Reference

### createNewUserInDatabase

**Overview:** This function adds user to userCollection for the first time. Won't add if user already exists.
**Inputs:**
Name | Type | Description
--- | --- | ---
user | `Firebase-auth user object` | The user to be added
**Outputs:**  `Boolean` Success, will return false if user already exists
