// ImageSlider.js
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Swiper from 'react-native-swiper';

const slides = [
  require('../assets/slides/1.webp'),
  require('../assets/slides/2.webp'),
  require('../assets/slides/3.webp'),
  require('../assets/slides/4.webp'),
];

const ImageSlider = () => {
  return (
    <Swiper style={styles.wrapper} showsButtons={false} showsPagination={false}>
      {slides.map((slide, index) => (
        <View style={styles.slide} key={index}>
          <Image 
            source={slide}
            style={styles.image}
          />
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 200,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default ImageSlider;