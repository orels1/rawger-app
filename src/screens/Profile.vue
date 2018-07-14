<template>
  <view class="container">
    <scroll-view
      class="content"
      :contentContainerStyle="{ alignItems: 'center' }"
      :showsVerticalScrollIndicator="false"
    >
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
        <touchable-opacity
          v-for="(stat, index) in stats"
          :key="stat.name"
          @press="expand(index)"
          class="stat-wrapper"
          :disabled="stats[index].expanded"
        >
          <animView
            class="stat"
            animation="fadeInUp"
            :duration="500"
            :delay="1100 + index * 100"
            easing="ease-out-back"
          >
            <view class="stat-header">
              <text class="stat-value text">{{stat.value}}</text>
              <text class="stat-name text">{{stat.name}}</text>
            </view>
            <view class="games" v-if="stats[index].expanded">
              <game
                v-for="(game, gameIndex) in games"
                :key="game.raw.id"
                :game="game"
                :index="gameIndex"
                :last="gameIndex === games.length - 1"
              />
            </view>
          </animView>
        </touchable-opacity>
      </animated:view>
    </scroll-view>

    <animated:image
      class="bg"
      :style="bgStyles"
      v-if="!!profile.background"
      :source="{ uri: profile.background }"
      :blurRadius="10"
    />
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { Animated, Image, Dimensions } from 'react-native';
import game from '../components/Game';
export default {
  components: {
    game
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
      { translate: new Animated.Value(50), opacity: new Animated.Value(0) }
    ],
    stats: [],
    images: []
  }),
  computed: {
    ...mapState(['api', 'profile', 'games']),
    avatarStyles: function() {
      return {
        transform: [{ translateY: this.jumpAnim }],
        opacity: this.fadeAnim
      };
    },
    bgStyles: function() {
      return {
        resizeMode: Image.cover,
        opacity: this.coverAnim
      };
    },
    userInfoStyles: function() {
      return {
        transform: [{ translateY: this.userInfoAnim }]
      };
    }
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
        Object.entries(newProfile.counters).forEach(([counter, value]) => {
          this.stats.push({
            name: counter,
            value,
            expanded: false
          });
        });
        this.animate();
      }
    }
  },
  methods: {
    ...mapActions(['loadProfile', 'loadGames']),
    animate: function() {
      const animations = this.statsAnim.map(stat => {
        return Animated.parallel([
          Animated.timing(stat.translate, {
            toValue: 0,
            duration: 400
          }),
          Animated.timing(stat.opacity, {
            toValue: 1,
            duration: 400
          })
        ]);
      });

      Animated.sequence([
        Animated.timing(this.coverAnim, {
          toValue: 0.4,
          duration: 800
        }),
        Animated.stagger(300, [
          Animated.parallel([
            Animated.spring(this.jumpAnim, {
              toValue: 0,
              duration: 700,
              friction: 5
            }),
            Animated.timing(this.fadeAnim, {
              toValue: 1,
              duration: 400
            }),
            Animated.spring(this.userInfoAnim, {
              toValue: 0,
              duration: 400
            })
          ]),
          Animated.stagger(100, animations)
        ])
      ]).start();
    },
    expand: async function(index) {
      console.log('expanding', index);
      if (this.stats[index].name === 'games') {
        await this.loadGames(this.api);
        this.images.push(...this.games.map(i => ({ loaded: false })));
        setTimeout(() => {
          this.stats[index].expanded = true;
        });
      } else {
        this.stats[index].expanded = true;
      }
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #151515;
  flex: 1;
  position: relative;
}
.content {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
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
  align-items: center;
  width: 80%;
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
  flex: 1;
  width: 90%;
  margin-bottom: 20px;
}
.stat-wrapper {
  margin-bottom: 5px;
  width: 100%;
}
.stat {
  background-color: hsla(0, 0%, 10%, 0.9);
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 6px;
}
.stat-header {
  padding-left: 20px;
  padding-right: 20px;
  flex-direction: row;
  align-items: flex-end;
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
.games {
  margin-top: 10px;
}
</style>
