<template>
  <main class="main">
    <div class="row p-2">
      <div class="col-12">
        <h1>
          <i class="fas fa-cog"></i>Paramètres du compte
        </h1>
        <hr />
      </div>
    </div>
    <section class="row user-info pl-5 pr-5">
      <div class="col-12">
        <h2>
          <u>Informations de l'utilisateur</u>
        </h2>
        <div class="user-info__block">
          <p class="user-info__block__title mb-0">Email</p>
          <p class="user-info__block__output">
            <small>{{user.email}}</small>
          </p>
        </div>
        <div class="user-info__block">
          <p class="user-info__block__title mb-0">Username</p>
          <p class="user-info__block__output">
            <small>{{user.username}}</small>
          </p>
        </div>
        <div class="user-info__block d-sm-flex justify-content-between user-info__block--flex">
          <div class="user-info__block">
            <p class="user-info__block__title mb-0">Password</p>
            <small class="user-info__block__output">
              Doit contenir au minimum 8 caractères dont une majuscule,
              et au minimum un caractère numérique et un caractère spécial
            </small>
          </div>
          <button
            type="button"
            class="btn btn-primary"
            data-toggle="modal"
            data-target="#BoxModalChgPwd"
            @click="testInputs"
          >Change</button>
          <!--Box Modal pour changement PWD-->
          <div
            class="modal fade"
            id="BoxModalChgPwd"
            tabindex="-1"
            role="dialog"
            aria-labelledby="BoxModalChgPwd__title"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="BoxModalChgPwd__title">Change Password</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <form>
                    <div class="form-group">
                      <label for="InputNewPassword">Entrez un nouveau password</label>
                      <input
                        type="password"
                        class="form-control"
                        id="InputNewPassword"
                        v-model="changePwd.newPassword"
                      />
                      <small
                        id="emailHelp"
                        class="form-text text-muted"
                      >Au minimum 8 caractères dont une majuscule, un minuscule, un caractère numérique et un caractère spécial</small>
                    </div>
                    <div class="form-group">
                      <label for="RepeatInputNewPassword">Répétez votre nouveau password</label>
                      <input
                        type="password"
                        class="form-control"
                        id="RepeatInputNewPassword"
                        v-model="changePwd.RepeatNewPassword"
                      />
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary" @click="changePassword">Save changes</button>
                </div>
                <p id="retour-api" class="text-center">{{retourAPI}}</p>
              </div>
            </div>
          </div>
          <!--END: Box Modal pour changement PWD-->
        </div>
        <button
          type="button"
          class="btn btn-danger white d-block mx-auto mt-5 mb-2"
          @click="deleteAccount"
        >Delete account</button>
      </div>
    </section>
  </main>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "User",
  data() {
    return {
      retourAPI: "",
      changePwd: {
        newPassword: null,
        RepeatNewPassword: null
      }
    };
  },
  computed: {
    ...mapState(["user"])
  },
  methods: {
    deleteAccount() {
      axios
        .delete("http://localhost:3000/api/user/delete", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(() => {
          localStorage.clear();
          location.replace(location.origin+'/#/signup');
        })
        .catch(error => console.log(error));
    },
    changePassword() {
      //Controle de la saisie du nouveau password
      //Controle de repeat et non null
      if (
        this.changePwd.newPassword == this.changePwd.RepeatNewPassword &&
        this.changePwd.newPassword != "" &&
        this.changePwd.RepeatNewPassword != ""
      ) {
        axios
          .put(
            "http://localhost:3000/api/user/update",
            {
              newPassword: this.changePwd.newPassword
            },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
              }
            }
          )
          .then(response => {
            console.log("pwd change", response);
            document.getElementById("retour-api").classList.add("text-success");
            this.retourAPI = response.data.confirmation;
            setTimeout(() => {
              this.retourAPI = "";
              window.location.reload();
            }, 2000);
          })
          .catch(err => {
            console.log("admin", err);
            this.retourAPI = "Une erreur est survenue, vérifier vos saisies";
          });
      } else {
        document.getElementById("retour-api").classList.add("text-danger");
        this.retourAPI = "Veuillez vérifier la saisie des mots de passe";
      }
    },
    testInputs() {
      //8 caractères dont au minimum une majuscule, une minuscule, un caractère numérique et un caractère spécial
      const regexPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/;
      let inputNewPwd = document.getElementById("InputNewPassword");
      let inputRepeatNewPwd = document.getElementById("RepeatInputNewPassword");
      inputNewPwd.addEventListener("input", function(e) {
        let value = e.target.value;
        let testValue = regexPassword.test(value);
        if (testValue) {
          inputNewPwd.style.backgroundColor = "#4CAF50";
        } else {
          inputNewPwd.style.backgroundColor = "#f44336";
        }
      });
      inputRepeatNewPwd.addEventListener("input", function() {
        if (
          inputRepeatNewPwd.value == inputNewPwd.value &&
          regexPassword.test(inputRepeatNewPwd.value)
        ) {
          inputRepeatNewPwd.style.backgroundColor = "#4CAF50";
        } else {
          inputRepeatNewPwd.style.backgroundColor = "#f44336";
        }
      });
    }
  },
  mounted() {
    this.$store.dispatch("getUserInfos");
  }
};
</script>

<style lang="scss">
</style>