/**
 * Sample React Native App
 * https://github.com/facebook/react-native
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

  if( snake.includes( item.key ) ){
    color = '#fbc900';
  }

  if( meal == item.key ){
    color = '#fe3d3d';
  }

  return(
    <View style={[ { backgroundColor: color }, styles.item]}>
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
    const { snake, direction } = this.state;
    snake.shift();
    let latest = snake[snake.length - 1];

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

    snake.push( latest );
    this.setState({ snake: snake });
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
    const { gridList, snake, meal } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        
        <FlatList
            style={styles.grid}
            data={gridList}
            renderItem={({ item }) => (<Block item={item} snake={snake} meal={meal} />)}
            keyExtractor={item => item.key}
            numColumns={15}
            refreshing={false}
        />

        <View style={styles.btnContainer}>
          <TouchableOpacity onPress={this.moveUp.bind(this)}>
            <View style={styles.button}>
              <Icon name="arrow-up" size={32} color="#d6d6d6" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={[ styles.btnContainer, {justifyContent: 'center'} ]}>
          <TouchableOpacity onPress={this.moveLeft.bind(this)}>
            <View style={[ styles.button, {marginLeft: 10, marginRight: 10} ]}>
              <Icon name="arrow-left" size={26} color="#d6d6d6" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.toggleGameStatus.bind(this)}>
            <View style={[ styles.button, {marginLeft: 10, marginRight: 10} ]}>
              <Icon name="play" size={30} color="#d6d6d6" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.moveRight.bind(this)}>
            <View style={[ styles.button, {marginLeft: 10, marginRight: 10} ]}>
              <Icon name="arrow-right" size={26} color="#d6d6d6" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity onPress={this.moveDown.bind(this)}>
            <View style={styles.button}>
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
    backgroundColor: '#00b2b5',
    height: '100%'
  },
  item: {
    height: (windowWidth-90)/15,
    width: (windowWidth-90)/15,
    margin: 2,
    borderRadius: (windowWidth-90)/15
  },
  grid: {
    margin: 10,
    padding: 0,
    borderWidth: 4,
    borderColor: '#029093',
    backgroundColor: '#00a2a5',
  },
  btnContainer:{
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    textAlign: 'center'
  },
  button:{
    backgroundColor: '#112d4e',
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 50,
    textAlign: 'center',
  },
});

export default App;
