<template>
  <animView
    animation="fadeInUp"
    :duration="300"
    :delay="index * 50"
    easing="ease-out-expo"
    class="game"
    :style="{ borderBottomWidth: last ? 0 : 1 }"
  >
    <view class="game-wrapper">
      <view class="game-image">
        <image
          v-if="game.image"
          class="game-cover"
          :source="{ uri: game.image }"
        />
      </view>
      <view class="game-info">
        <text class="game-name" :numberOfLines="2">{{game.name}}</text>
        <text class="game-platform">{{game.platforms[0]}}</text>
      </view>
      <touchable-highlight class="edit-wrapper" underlayColor="hsla(0,0%, 95%, 0.2)" :onPress="edit">
        <view class="edit-button">
          <text class="edit-label">Edit</text>
        </view>
      </touchable-highlight>
    </view>
    <animView v-if="editing" transition="height" :duration="300" :style="{ height: editing ? 30 : 0 }" class="edit-controls">
      <text :style="{ color: '#fcfcfc' }">to play</text>
    </animView>
  </animView>
</template>

<script>
export default {
  props: {
    game: Object,
    index: Number,
    last: Boolean
  },
  methods: {
    ping: function() {
      console.log('ping');
    },
    edit: function() {
      this.editing = !this.editing;
    }
  },
  data: () => ({
    editing: false
  })
};
</script>

<style scoped>
.game {
  width: 100%;
  padding: 10px;
  border-bottom-color: hsla(0, 0%, 50%, 0.3);
  border-bottom-width: 1px;
}
.game-wrapper {
  flex-direction: row;
}
.game-image {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  background-color: hsl(0, 0%, 20%);
}
.game-cover {
  width: 48px;
  height: 48px;
  border-radius: 4px;
}
.game-info {
  padding-top: 5px;
  padding-bottom: 5px;
  margin-left: 10px;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
}
.game-name {
  color: hsl(0, 0%, 90%);
  font-weight: bold;
  font-size: 12px;
}
.game-platform {
  color: hsl(0, 0%, 80%);
  font-size: 10px;
}
.edit-wrapper {
  border-radius: 4px;
}
.edit-button {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  border-color: #539e67;
  border-width: 1px;
}
.edit-label {
  color: #539e67;
  text-align: center;
  width: 100%;
  line-height: 46px;
}
.edit-controls {
  backface-visibility: hidden;
}
</style>
