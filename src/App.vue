<template>
  <app-navigation></app-navigation>
</template>

<script>
import React from 'react';
import { mapActions } from 'vuex';
import { TabNavigator } from 'vue-native-router';
import Ionicons from '@expo/vector-icons/Feather'
import Profile from './screens/Profile';
import Activity from './screens/Activity';
import store from './store';

const AppNavigation = TabNavigator(
  {
    Profile,
    Activity,
  },
  {
    initialRouteName: 'Profile',
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Profile':
            iconName = 'user';
            break;
          case 'Activity':
            iconName = 'activity';
            break;
          default:
            iconName = 'lock';
            break;
        }

        return <Ionicons name={iconName} size={25} color={tintColor} />
      },
    }),
    animationEnabled: true,
    tabBarOptions: {
      style: {
        backgroundColor: '#fcfcfc',
      }
    },
    lazy: false,
    swipeEnabled: true,
  },
);

export default {
  components: { AppNavigation },
  store,
  methods: {
    ...mapActions(['initiateApi'])
  },
  created: async function() {
    await this.initiateApi();
  }
}
</script>
