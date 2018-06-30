<template>
  <view class="container">
    <animated:view
      class="avatar-container"
      :style="avatarStyles"
      v-if="!!Object.keys(profile).length"
    >
      <image class="avatar" :source="{ uri: profile.avatar }" />
      <animated:view :style="userInfoStyles" class="user-info">
        <text class="text name">{{profile.full_name}}</text>
        <text class="text bio">{{profile.bio}}</text>
      </animated:view>
    </animated:view>

    <animated:view class="stats" v-if="!!Object.keys(profile).length">
      <animated:view class="stat" v-for="(stat, index) in stats" :key="stat.name" :style="statStyle(index)">
        <text class="stat-value text">{{stat.value}}</text>
        <text class="stat-name text">{{stat.name}}</text>
      </animated:view>
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
    userInfoStyles: function() {
      return ({
        transform: [
          { translateY: this.userInfoAnim },
        ],
      });
    },
    stats: function() {
      if (!this.profile.games_count) return ([]);
      return ([
        { name: 'games', value: this.profile.games_count },
        { name: 'reviews', value: this.profile.reviews_count },
        { name: 'collections', value: this.profile.collections_count },
        { name: 'comments', value: this.profile.comments_count }
      ]);
    }
  },
  data: () => ({
    loaded: false,
    jumpAnim: new Animated.Value(100),
    fadeAnim: new Animated.Value(0),
    coverAnim: new Animated.Value(0),
    userInfoAnim: new Animated.Value(80),
    statsAnim: [
      { translate: new Animated.Value(50), opacity: new Animated.Value(0) },
      { translate: new Animated.Value(50), opacity: new Animated.Value(0) },
      { translate: new Animated.Value(50), opacity: new Animated.Value(0) },
      { translate: new Animated.Value(50), opacity: new Animated.Value(0) },
    ]
  }),
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
      const animations = this.statsAnim.map((stat) => {
        return Animated.parallel([
          Animated.timing(
            stat.translate,
            {
              toValue: 0,
              duration: 400,
            }
          ),
          Animated.timing(
            stat.opacity,
            {
              toValue: 1,
              duration: 400,
            }
          ),
        ]);
      })

      Animated.sequence([
        Animated.timing(
          this.coverAnim,
          {
            toValue: .4,
            duration: 800
          }
        ),
        Animated.stagger(300, [
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
              this.userInfoAnim,
              {
                toValue: 0,
                duration: 400,
              }
            ),
          ]),
          Animated.stagger(100, animations)
        ])
      ]).start();
    },
    statStyle: function (index) {
      return ({
        transform: [
          { translateY: this.statsAnim[index].translate }
        ],
        opacity: this.statsAnim[index].opacity
      });
    }
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
  margin-top: 50px;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
  align-items: center;
  width: 80%
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50px;
}
.user-info {
  align-items: center;
}
.name {
  margin-top: 10px;
  margin-bottom: 16px;
  font-size: 36px;
  font-weight: bold;
}
.bio {
  font-size: 14px;
  text-align: center;
}
.text-color-primary {
  color: blue;
}
.text {
  position: relative;
  z-index: 2;
  color: #fcfcfc;
}
.stats {
 position: relative;
 z-index: 2;
 flex: 1;
 width: 90%;
 flex-wrap: wrap;
}
.stat {
  flex-direction: row;
  align-items: flex-end;
  background-color: hsla(0, 0%, 10%, .9);
  padding-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 10px;
  border-radius: 6px;
  margin: 5px;
}
.stat-value {
  font-size: 36px;
  font-weight: bold;
}
.stat-name {
  position: relative;
  bottom: 4px;
  font-size: 18px;
}
</style>
