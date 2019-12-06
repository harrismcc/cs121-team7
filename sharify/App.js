//pagination
import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

//must be installed
import { AsyncStorage } from 'react-native';
import { AuthorizeWithSpotify } from "./spotifyAuth.js";
import { ShowPlaylists } from './pages/showPlaylistsPage.js'
import { LoginFormPage } from "./pages/loginPage.js"
import { RecsPage } from "./pages/recsTestPage.js"
import { QrCodeReader } from "./pages/qrCodeReader.js"
import { MainScreen } from "./MainPage.js"

//exporting one thing by default so don't use {}
import PlaySong from "./pages/playSong.js"
import HostPage from "./pages/hostPlaylistUI.js"
import JoinPage from "./pages/joinerPlaylistUI.js"
import CreatePage from "./pages/createNew.js"
import hostPage from './pages/hostPlaylistUI.js';
import DisplaySinglePlaylist from "./pages/displaySinglePlaylist.js";



//Init navigator and add pages
const MainNavigator = createStackNavigator({
  MainPage: {screen: MainScreen},
  Home: {screen: ShowPlaylists},
  SpotifyAuth: {screen: AuthorizeWithSpotify},
  HostPage : {screen: HostPage},
  JoinPage : {screen: JoinPage},
  
  LoginPage: {screen: LoginFormPage},
  MusicPage: {screen: PlaySong},
  RecsPage : {screen: RecsPage},
  QrCodePage : {screen: QrCodeReader},
  CreatePage : {screen : CreatePage},
  DisplaySinglePlaylistPage : {screen : DisplaySinglePlaylist},
},
{navigationOptions: ({ navigation }) => ({
  tabBarVisible: navigation.state.index < 4,
})},
);

const HostNavigator = createStackNavigator({
  HostPage : {screen: HostPage},
  QrCodePage : {screen: QrCodeReader},
  SpotifyAuth: {screen: AuthorizeWithSpotify},
  LoginPage: {screen: LoginFormPage},
  CreatePage : {screen : CreatePage},
  DisplaySinglePlaylistPage : {screen : DisplaySinglePlaylist},
},
    {navigationOptions: ({ navigation }) => ({
      tabBarVisible: navigation.state.index < 1,
    })},
)

const JoinNavigator = createStackNavigator({
  JoinPage : {screen: JoinPage},
  QrCodePage : {screen: QrCodeReader},
  SpotifyAuth: {screen: AuthorizeWithSpotify},
  LoginPage: {screen: LoginFormPage},
  QrCodePage : {screen: QrCodeReader},
  DisplaySinglePlaylistPage : {screen : DisplaySinglePlaylist},
},
{navigationOptions: ({ navigation }) => ({
  tabBarVisible: navigation.state.index < 1,
})},
)

const bottomTabNavigator = createBottomTabNavigator(
  {
    HostPage : {screen: HostNavigator},
    MainPage: {screen: MainNavigator},
    JoinPage : {screen: JoinNavigator},

  },
  {
    initialRouteName: 'MainPage',
    //navigationOptions : MainNavigator
    // {
    //   SpotifyAuth: {screen: AuthorizeWithSpotify},
    //   LoginPage: {screen: LoginFormPage},
    //   QrCodePage : {screen: QrCodeReader},
    // }
  },
  {
    
    headerStyles: {
      backgroundColor : "green",
    }
  }
);

//create app from navigator
const App = createAppContainer(bottomTabNavigator);


// const App = createSwitchNavigator({
//   Main :  MainScreenNavigator,
//   App : {screen : bottomTabNavigator} 
// })

//export app object
export default App;





