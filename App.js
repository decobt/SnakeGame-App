/**
 * Snake Game App
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions
} from 'react-native';

const windowWidth = Dimensions.get('window').width;

function Block({item, snake, meal}){
  let color = 'transparent';
  let radius = 4;
  if( snake.includes( item.key ) ){
    color = '#371832';
  }

  if( meal == item.key ){
    color = '#e33b2e';
    radius = (windowWidth-130)/15;
  }

  return(
    <View style={[ styles.item, { backgroundColor: color, borderRadius:radius }]}>
      <Text style={styles.title}>{ /* item.key */ }</Text>
    </View>
  );
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gridList: Array.from(Array(300), (x,index)=>{ a=index; index++; return {key: a};}),
      snake: [0,1,2,3],
      meal: 500,
      direction: 'right',
      start: false,
      score: 0
    };
  }

  chooseMeal() {
    const { snake } = this.state;
    do {
      meal = Math.floor(Math.random() * 300); // pick a random position, 0 to 300
    } while ( snake.includes( meal ));

    return meal;
  }

  toggleGameStatus() {
    const { start, meal } = this.state;
    if(start == false){
      this.setState({ start: true, meal: this.chooseMeal() });

      interval = setInterval(() => {
        this.takeStep();
      }, 300);
    }else{
      clearInterval(interval);
      this.setState({ start: false });
    }
  }

  takeStep(){
    const { snake, direction, meal, score } = this.state;
    let latest = snake[snake.length - 1];

    //move the snake by one place
    switch(direction){
      case 'right': { latest = latest + 1; break; }
      case 'left': { latest = latest - 1; break; }
      case 'down': { 
        latest = latest + 15;
        if(latest > 300){
          latest = latest - 300;
        } 
        break; }
      case 'up': { 
        latest = latest - 15; 
        if(latest < 0){
          latest = latest + 300;
        } 
        break; }
    }

    //check if snake has hit itself
    if(snake.includes( latest )){
      this.setState({ start: false, snake: [], meal:500 });
    }else{
      //if not update the snake with another block
      snake.push( latest );

      //calculate if meal is reached
      if(latest!=meal){
        snake.shift();
      }else{
        this.setState({ meal: this.chooseMeal(), score: score+1 });
      }
  
      this.setState({ snake: snake });
    }
  }

  moveLeft(){
    this.setState({ direction: 'left'});
  }

  moveRight(){
    this.setState({ direction: 'right'});
  }

  moveDown(){
    this.setState({ direction: 'down'});
  }

  moveUp(){
    this.setState({ direction: 'up'});
  }

  render() {
    const { gridList, snake, meal, score } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        
        <Text style={styles.text}>Your score: {score}</Text>
        <View style={styles.gridContainer}>
        <FlatList
            style={styles.grid}
            data={gridList}
            renderItem={({ item }) => (<Block item={item} snake={snake} meal={meal} />)}
            keyExtractor={item => item.key}
            numColumns={15}
            refreshing={false}
        />
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity onPress={this.moveUp.bind(this)}>
            <View style={styles.buttonRed}>
              <Icon name="arrow-up" size={32} color="#d6d6d6" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={[ styles.btnContainer, {justifyContent: 'center'} ]}>
          <TouchableOpacity onPress={this.moveLeft.bind(this)}>
            <View style={[ styles.buttonRed, {marginLeft: 10, marginRight: 10} ]}>
              <Icon name="arrow-left" size={30} color="#d6d6d6" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.toggleGameStatus.bind(this)}>
            <View style={[ styles.buttonGreen, {marginLeft: 10, marginRight: 10} ]}>
              <Icon name="play" size={30} color="#312849" style={{marginLeft: 5}} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.moveRight.bind(this)}>
            <View style={[ styles.buttonRed, {marginLeft: 10, marginRight: 10} ]}>
              <Icon name="arrow-right" size={30} color="#d6d6d6" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity onPress={this.moveDown.bind(this)}>
            <View style={styles.buttonRed}>
              <Icon name="arrow-down" size={32} color="#d6d6d6" />
            </View>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4a426b',
    height: '100%'
  },
  containerInner: {
    backgroundColor: '#4a426b',
    height: '90%'
  },
  item: {
    height: (windowWidth-90)/15,
    width: (windowWidth-130)/15,
    margin: 2
  },
  text: {
    textAlign: 'center',
    color: '#fff'
  },
  gridContainer: {
    borderWidth: 4,
    margin: 20,
    borderColor: '#31988b',
    borderRadius: 10
  },
  grid: {
    padding: 0,
    borderWidth: 10,
    borderRadius:10,
    backgroundColor: '#fbc900',
    borderBottomColor: '#736bac',
    borderTopColor: '#312849',
    borderLeftColor: '#42426b',
    borderRightColor: '#42426b'
  },
  btnContainer:{
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    textAlign: 'center'
  },
  buttonRed:{
    backgroundColor: '#ef6b5a',
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 50,
    textAlign: 'center',
    shadowColor: '#e33b2e',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  buttonGreen:{
    backgroundColor: '#00e7ad',
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 50,
    textAlign: 'center',
    shadowColor: '#0d8a6f',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 1,
    shadowRadius: 2,
  },
});

export default App;
