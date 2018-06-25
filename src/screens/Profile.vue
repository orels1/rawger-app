<template>
  <view class="container">
    <animated:view
      class="avatar-container"
      :style="avatarStyles"
      v-if="!!Object.keys(profile).length"
    >
      <image class="avatar" :source="{ uri: profile.avatar }" />
      <animated:text :style="nameStyles" class="text name">{{profile.full_name}}</animated:text>
    </animated:view>

    <animated:image
      class="bg"
      :style="bgStyles"
      v-if="!!profile.game_background"
      :source="{ uri: profile.game_background.url }"
      :blurRadius="10"
    />
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { Animated, Image } from 'react-native';
export default {
  computed: {
    ...mapState(['api', 'profile']),
    avatarStyles: function() {
      return ({
        transform: [
          { translateY: this.jumpAnim },
        ],
        opacity: this.fadeAnim,
      });
    },
    bgStyles: function() {
      return ({
        resizeMode: Image.cover,
        opacity: this.coverAnim
      });
    },
    nameStyles: function() {
      return ({
        transform: [
          { translateY: this.nameAnim },
        ],
      });
    }
  },
  data: {
    loaded: false,
    jumpAnim: new Animated.Value(100),
    fadeAnim: new Animated.Value(0),
    coverAnim: new Animated.Value(0),
    nameAnim: new Animated.Value(80),
  },
  watch: {
    api: function(newApi, old) {
      if (newApi && !this.loaded) {
        this.loaded = true;
        this.loadProfile(newApi);
      }
    },
    profile: function(newProfile) {
      if (newProfile && newProfile.avatar) {
        console.log(newProfile);
        this.animate();
      }
    }
  },
  methods: {
    ...mapActions(['loadProfile']),
    animate: function() {
      Animated.sequence([
        Animated.timing(
          this.coverAnim,
          {
            toValue: .4,
            duration: 800
          }
        ),
        Animated.parallel([
          Animated.spring(
            this.jumpAnim,
            {
              toValue: 0,
              duration: 700,
              friction: 5
            },
          ),
          Animated.timing(
            this.fadeAnim,
            {
              toValue: 1,
              duration: 400
            }
          ),
          Animated.spring(
            this.nameAnim,
            {
              toValue: 0,
              duration: 400,
            }
          )
        ]),
      ]).start();
    },
  },
}
</script>

<style scoped>
.container {
  background-color: #151515;
  align-items: center;
  flex: 1;
  position: relative;
}
.bg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
}
.avatar-container {
  margin: 75px 20px 20px 20px;
  position: relative;
  z-index: 2;
  align-items: center;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50px;
}
.name {
  margin-top: 10px;
  margin-bottom: 16px;
  font-size: 36px;
  font-weight: bold;
}
.text-color-primary {
  color: blue;
}
.text {
  position: relative;
  z-index: 2;
  color: #fcfcfc;
}
</style>
