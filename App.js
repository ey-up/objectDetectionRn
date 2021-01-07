import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImgToBase64 from 'react-native-image-base64';

import {Kare} from './src/Kare';
var liste = [];
var res = [];
const windowWidth = Dimensions.get('window').width;
const App = () => {
  const [image, setImage] = useState(null);
  const [check, setCheck] = useState(true);
  const [base64, setBase64] = useState('null');

  const API_KEY = 'myKey';
  const API_URL2 = `https://vision.googleapis.com/v1/images:annotate?key=`;

  const callGoogleVIsionApi = async () => {
    setCheck(false);
    let googleVisionRes = await fetch(API_URL2 + API_KEY, {
      method: 'POST',
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64,
            },
            features: [{maxResults: 55, type: 'OBJECT_LOCALIZATION'}],
          },
        ],
      }),
    });

    await googleVisionRes
      .json()
      .then((googleVisionRes) => {
        res = googleVisionRes.responses[0].localizedObjectAnnotations;
        for (let i = 0; i < res.length; i++) {
          liste.push(figureOut(res[i].boundingPoly.normalizedVertices));
          liste[i].id = i;
          liste[i].name = res[i].name;
        }
        for (let i = 0; i < res.length; i++) {
          res[i].id = i;
        }
        setCheck(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function figureOut(arr) {
    let rest = {top: 0.0, bottom: 1.0, left: 1.0, right: 0.0};
    var nullCheck = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].y != null) {
        if (arr[i].y > rest.top) rest.top = arr[i].y;
        if (arr[i].y < rest.bottom) rest.bottom = arr[i].y;
      } else {
        nullCheck = true;
      }
      if (arr[i].x != null) {
        if (arr[i].x < rest.left) rest.left = arr[i].x;
        if (arr[i].x > rest.right) rest.right = arr[i].x;
      } else {
        nullCheck = true;
      }
    }
    if (nullCheck) {
      if (rest.left == rest.right) {
      } else {
        let temp = rest.top;
        rest.top = 370 * rest.bottom;
        rest.bottom = 370 - 370 * temp;
        rest.left = 370 * rest.left;
        rest.right = 370 - 370 * rest.right;
        rest.top = 0;
      }
    } else {
      let temp = rest.top;
      rest.top = 370 * rest.bottom;
      rest.bottom = 370 - 370 * temp;
      rest.left = 370 * rest.left;
      rest.right = 370 - 370 * rest.right;
    }

    //right
    return rest;
  }

  function imageToBase64(img) {
    ImgToBase64.getBase64String(img)
      .then((base64String) => {
        setBase64(base64String);
      })
      .catch((err) => console.log(err));
  }

  function openGallery() {
    liste = [];
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, async (callback) => {
      if (callback.didCancel) {
        console.log('User cancelled image picker');
      } else if (callback.error) {
        console.log('ImagePicker Error: ', callback.error);
      } else if (callback.customButton) {
        console.log('User tapped custom button: ', callback.customButton);
      } else {
        setImage(callback.uri);
        imageToBase64(callback.uri);
      }
    });
  }

  function openCamera() {
    liste = [];
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, (callback) => {
      if (callback.didCancel) {
        console.log('User cancelled image picker');
      } else if (callback.error) {
        console.log('ImagePicker Error: ', callback.error);
      } else if (callback.customButton) {
        console.log('User tapped custom button: ', callback.customButton);
      } else {
        setImage(callback.uri);
        imageToBase64(callback.uri);
      }
    });
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View style={{flex: 1}}>
          {/* İmage'in işlenmemiş hali */}
          <View style={styles.imageViewContainer}>
            {check ? (
              // <View
              //   style={{width: 300, height: 300, backgroundColor: 'blue'}}>
              <Kare img={image} list={liste} />
            ) : (
              <ActivityIndicator size="large" color="darkblue" />
            )}
          </View>
          {/* Butonlar */}
          <View style={{marginTop: 30, height: 220, alignItems: 'center'}}>
            <View style={{height: 50, flexDirection: 'row'}}>
              <View style={styles.buttonViewContainer}>
                {/*galeri */}
                <Button
                  color="darkblue"
                  title="Fotoğraf seç"
                  onPress={openGallery}></Button>
              </View>
              <View style={styles.buttonViewContainer}>
                {/*kamera */}
                <Button
                  color="darkblue"
                  title="Kamerayı aç "
                  onPress={openCamera}></Button>
              </View>
            </View>
            <View style={{marginTop: 40, height: 50, flexDirection: 'row'}}>
              <View style={styles.buttonViewContainer}>
                <Button
                  color="darkblue"
                  title="Nesneleri Tespit et"
                  onPress={callGoogleVIsionApi}></Button>
              </View>
            </View>
          </View>

          {check && (
            <View
              style={[styles.buttonViewContainer, {height: 500}, {width: 200}]}>
              {res.map((prop, id) => {
                return (
                  <View key={prop.id}>
                    <Text
                      style={{
                        fontSize: 17,
                        color: 'darkblue',
                        fontWeight: 'bold',
                        marginLeft: 20,
                      }}>
                      {prop.name}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  imageViewContainer: {
    width: windowWidth - 10,
    height: 400,
    borderWidth: 2.5,
    borderColor: 'darkblue',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  imageDetViewContainer: {
    width: 300,
    borderWidth: 2.5,
    borderColor: 'darkblue',
    margin: 5,
  },
  image: {
    width: 350,
    height: 350,
  },
  buttonViewContainer: {
    height: 50,
    width: 100,
    margin: 10,
  },
});
export default App;
