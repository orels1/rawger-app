const expo = require('expo');
import { TouchableOpacity } from 'react-native';
import Vue from 'vue-native-core';
import * as Animatable from 'react-native-animatable';
const App = require('./App');

Vue.component('anim-view', Animatable.View);
Vue.component('anim-text', Animatable.Text);
Vue.component('anim-image', Animatable.Image);
Vue.component(
  'anim-touchable',
  Animatable.createAnimatableComponent(TouchableOpacity)
);

if (process.env.NODE_ENV === 'development') {
  expo.KeepAwake.activate();
}

expo.registerRootComponent(App.default);
