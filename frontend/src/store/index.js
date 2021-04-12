import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      username: 'Nc',
      userId: 'Nc',
      email: 'Nc',
      token: null,
      isAdmin: false
    },
    editOption: ""
  },
  // change le state donné
  mutations: {
    saveUserInfos(state, [username, userId, email, isAdmin]) {
      //  réinitialisation des données utilisateur
      state.user.username = username,
          state.user.userId = userId,
          state.user.email = email,
          state.user.token = localStorage.getItem('token'),
          state.user.isAdmin = isAdmin
    },
    editStyle(state, value) {
      state.editOption = value
    }
  },
  // methode 
  actions: {
    getUserInfos(context) {
      axios
        .get("http://localhost:3000/api/user/me", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(response => {
          console.log('réponse API',response);
          context.commit('saveUserInfos',[response.data.username, response.data.id, response.data.email, response.data.isAdmin])
        })
        .catch(error => {
          console.log('Erreur auth', error); //affiche pas le message 'normalement' envoyé par le back
        });
    },
    changeEditStyle(context, value){
      // appelle la mutation editStyle
      context.commit('editStyle',value)
    }
  },
  modules: {
  }
})
