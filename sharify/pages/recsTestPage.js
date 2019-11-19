import React from 'react';
import { Text, View, Button, ScrollView, Slider } from 'react-native';
import { AsyncStorage } from 'react-native';
import { testRec, getRecs } from "../spotifyAuth.js";
import {getUserFloats} from "../iterRec.js";

//StyleSheet
import {styles} from '../stylesheet.js'

//This page is the main page that shows the lists of playlist names
export class RecsPage extends React.Component {
    static navigationOptions = {
      title: 'Recommendations',
    };
  
   constructor(props) {
    super(props);
     
    //set default state
    this.state = {
      result: null,
      danceabilitySliderValue: 0,
      energySliderValue: 0,
      popularitySliderValue: 0,
      valenceSliderValue: 0,
    };
   }
    
    render() {
      
      const {navigate} = this.props.navigation;
      return (
        
        <View style={styles.container}>
          
          <Text>Recs hardcoded based on song: Despacito</Text>
          <View style={styles.labeledSlider}>
          <Text>Danceability:</Text>
            <Slider
              style={{width: 200, height: 10}}
              step={0.01}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="grey"
              maximumTrackTintColor="#000000"
              onValueChange = {(sliderValue) => this.setState({danceabilitySliderValue: sliderValue})}
            />
            <Text>{this.state.danceabilitySliderValue.toFixed(2)}</Text>
          </View>

          
          <View style={styles.labeledSlider}>
            <Text>Energy:</Text>
            <Slider
              style={{width: 200, height: 10}}
              step={0.01}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="grey"
              maximumTrackTintColor="#000000"
              onValueChange = {(sliderValue) => this.setState({energySliderValue: sliderValue})}
            />
            <Text>{this.state.energySliderValue.toFixed(2)}</Text>
          </View>

          <View style={styles.labeledSlider}>
            <Text>Popularity:</Text>
            <Slider
              style={{width: 200, height: 10}}
              step={0.01}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="grey"
              maximumTrackTintColor="#000000"
              onValueChange = {(sliderValue) => this.setState({popularitySliderValue: sliderValue})}
            />
            <Text>{this.state.popularitySliderValue.toFixed(2)}</Text>
          </View>

          <View style={styles.labeledSlider}>
            <Text>Valence:</Text>
            <Slider
              style={{width: 200, height: 10}}
              step={0.01}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="grey"
              maximumTrackTintColor="#000000"
              onValueChange = {(sliderValue) => this.setState({valenceSliderValue: sliderValue})}
            />
            <Text>{this.state.valenceSliderValue.toFixed(2)}</Text>
          </View>

          <View style={[{margin: 10}]}>
            <Button title="Get Recs" onPress={this._test} />
            
          </View>
          
          
  
         
  
          
         

          <View style={{height: 400}}>
            <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}>
            {this.state.topTrackArray ? (
              this.state.topTrackArray.map((item, key)=>(

                <View key={key} style={styles.songDisplayRowItem} >
                  <Text key={key+ this.state.topTrackArray.length} style={styles.TextStyle}> { item.name }</Text>
                  <Text key={key + this.state.topTrackArray.length*2} style={{fontSize:10}}> {item.album.name}</Text>
                  
                </View>
              ))
            ) : null}
            </ScrollView>
          </View>
          </View>
      );
    }

  
    _test = async () => {

     
      //add top tracks to state
      /*const topRecs = await testRec({
                                      danceabilityVal: this.state.danceabilitySliderValue,
                                      energyVal: this.state.danceabilitySliderValue,
                                      popularityVal: this.state.popularitySliderValue,
                                      valenceVal: this.state.valenceSliderValue
                                    });*/

      const topRecs = await getRecs(getUserFloats(), [
        "2Th9BGKvfZG8bKQSACitwG",
        "5By7Pzgl6TMuVJG168VWzS",
        "0djZ2ndRfAL69WYNra5jRC"])
      this.setState({topTrackArray : topRecs});

      //await testRec();

      //test = await getLastFive("0zweTLBRy9bqPA6GUPTV1e")
    
      
    }
  
  
    
  }