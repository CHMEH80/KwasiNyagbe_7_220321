<template>
  <main class="main main--connect">
    <form class="w-75 align-items-center form-block d-flex m-auto shadow rounded">
      <div
        class="form-block--left d-flex flex-column justify-content-center block-demi-container p-3 text-right align-self-stretch"
      >
        <img class="logo align-self-end" src="../assets/icon.svg" alt="Logo Groupomania" />
        <p>
          <small>
            Vous avez déjà un compte,
            <router-link class="redirection-singup" to="/login">connecter-vous</router-link>
          </small>
        </p>
      </div>
      <div class="block-demi-container p-3">
        <div class="form-group">
          <label for="inputEmail">Email Groupomania</label>
          <input type="email" class="form-control" id="inputEmail" v-model="dataSignup.email" />
        </div>
        <div class="form-group">
          <label for="inputUsername">Username</label>
          <input type="text" class="form-control" id="inputUsername" v-model="dataSignup.username" />
        </div>
        <div class="form-group">
          <label for="inputPassword">Password</label>
          <input
            type="password"
            class="form-control"
            id="inputPassword"
            v-model="dataSignup.password"
          />
        </div>
        <button @click.prevent="sendSignup" type="submit" class="btn btn-primary">Submit</button>
      </div>
    </form>
  </main>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  name: "SignUp",
  data() {
    return {
      dataSignup: {
        username: null,
        email: null,
        password: null
      },
      msg: ""
    };
  },
  computed: {
    ...mapState(["user"])
  },
  methods: {
    sendSignup() {
      const regexPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/
      const regexEmail = /^[a-z0-9!#$ %& '*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&' * +/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/g;
      const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
      if (
        (this.dataSignup.email !== null ||
        this.dataSignup.username !== null ||
        this.dataSignup.password !== null) &&
        (regexPassword.test(this.dataSignup.password) && regexEmail.test(this.dataSignup.email) && usernameRegex.test(this.dataSignup.username))
      ) {
        axios
          .post("http://localhost:3000/api/user/signup", this.dataSignup)
          .then(response => {
            console.log(response);
            //Réinitialisation
            this.dataSignup.email = null;
            this.dataSignup.username = null;
            this.dataSignup.password = null;
          })
          .catch(error => console.log(error));
      } else {
        alert("Un problème est survenue avec vos saisies");
      }
    }
  }
};
</script>

<style lang="scss">
</style>