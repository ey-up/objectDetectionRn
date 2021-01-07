import React from 'react';
import {Text, StyleSheet, Dimensions, View, Image} from 'react-native';

const windowWidth = Dimensions.get('window').width;

const Kare = (props) => (
  <View style={styles.imageContainer}>
    <Image
      source={{
        uri: props.img,
      }}
      style={styles.image}
      resizeMode="stretch"
    />

    {props.list.map((prop, id) => {
      return (
        <View
          key={prop.id}
          style={[
            styles.rectangle,
            {
              top: prop.top,
              bottom: prop.bottom,
              left: prop.left,
              right: prop.right,
            },
          ]}>
          <Text style={{color: 'red'}}>
            {' '}
            {prop.id + 1}-{prop.name}{' '}
          </Text>
        </View>
      );
    })}
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  imageContainer: {
    width: windowWidth - 30,
    height: 380,
    alignSelf: 'center',
  },
  image: {
    width: windowWidth - 30,
    height: 380,
  },
  rectangle: {
    borderWidth: 2,
    borderColor: 'green',
    position: 'absolute',
  },
});
export {Kare};
