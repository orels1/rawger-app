const expo = require('expo');
const App = require('./App');

if (process.env.NODE_ENV === 'development') {
  expo.KeepAwake.activate();
}

expo.registerRootComponent(App.default);
