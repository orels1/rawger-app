import Vue from 'vue-native-core';
import Vuex from 'vuex';
import Rawger from 'rawger';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    api: null,
    profile: {},
    games: []
  },
  mutations: {
    initiateApi(state, api) {
      state.api = api;
    },
    loadProfile(state, profile) {
      state.profile = profile;
    },
    loadGames(state, games) {
      state.games = games;
    }
  },
  actions: {
    initiateApi: async ({ commit }) => {
      const rawger = await Rawger();
      commit('initiateApi', rawger);
    },
    loadProfile: async ({ commit }, client) => {
      try {
        const resp = await client.users('orels1').profile();
        const profile = resp.get();
        // const resp = await fetch('https://api.rawg.io/api/users/orels1');
        // const profile = await resp.json();
        commit('loadProfile', profile);
      } catch (e) {
        console.log(e);
      }
    },
    loadGames: async ({ commit }, client) => {
      try {
        const resp = await client.users('orels1').games('owned');
        const games = resp.get();
        commit('loadGames', games);
      } catch (e) {
        console.log(e);
      }
    }
  }
});

export default store;
