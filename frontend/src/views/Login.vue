<template>
  <main class="main main--connect">
    <form class="w-75 align-items-center form-block d-flex m-auto shadow rounded">
      <div
        class="form-block--left d-flex flex-column justify-content-center block-demi-container p-3 text-right align-self-stretch"
      >
        <img class="logo align-self-end" src="../assets/icon.svg" alt="Logo Groupomania" />
        <p>
          <small>
            Vous n'avez pas encore de compte,
            <router-link class="redirection-singup" to="/signup">enregistrez-vous</router-link>
          </small>
        </p>
      </div>
      <div class="block-demi-container p-3">
        <div class="form-group">
          <label for="inputUsername">Username</label>
          <input type="text" class="form-control" id="inputUsername" v-model="dataLogin.username" />
        </div>
        <div class="form-group">
          <label for="inputPassword">Password</label>
          <input
            type="password"
            class="form-control"
            id="inputPassword"
            v-model="dataLogin.password"
          />
        </div>
        <button @click.prevent="logIn" type="submit" class="btn btn-primary">Submit</button>
      </div>
    </form>
  </main>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";


export default {
  name: "SignUp",
  data() {
    return {
      dataLogin: {
        username: null,
        password: null
      },
      msg: ""
    };
  },
  computed: {
    ...mapState(["user"])
  },
  // connexion d'un utilisateur existant
  methods: {
    logIn() {
      if (
        this.dataLogin.username !== null ||
        this.dataLogin.password !== null
      ) {
        axios
          .post("http://localhost:3000/api/user/login", this.dataLogin)
          .then(response => {
            localStorage.setItem('token',response.data.token)
            location.replace(location.origin)
          })
          .catch(error => console.log(error));
      } else {
        console.log("Une erreur s'est produite !");
      }
    }
  }
};
</script>

<style lang="scss">
</style>