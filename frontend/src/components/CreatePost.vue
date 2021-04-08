<template>
  <div>
    <div class="block-post">
      <h3>Créer un post</h3>
      <form enctype="multipart/form-data" action="/create" method="post">
        <div class="input-group mb-3">
          <label for="input_text">Racontez nous une histoire ou partez-nous un article:</label>
          <br />
          <input v-model="contentPost.content" class="input-text" id="input_text" type="text" />
        </div>

        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputFileAddon">Upload</span>
          </div>
          <div class="custom-file">
            <input
              name="inputFile"
              type="file"
              class="custom-file-input"
              id="inputFile"
              aria-describedby="inputFileAddon"
              @change="onFileChange"
            />
            <label class="custom-file-label" for="inputFile">Choose file</label>
          </div>
        </div>
        <!-- envoi des données du post-->
        <input type="submit" class="btn btn-primary" @click.prevent="createPost" value="Submit" />
        <!-- message afficher cas où l'utilisateur n'est pas connu -->
        <span id='msgReturnAPI' class="mx-3 text-danger" v-if="user.token==null">Veuillez vous connecter</span>
        <!-- sinon affichage message d'erreur envoyé par l'Api backend -->
        <span id='msgReturnAPI' class="mx-3" v-else>{{msgError}}</span>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
// définit les propriétés des données d'un post
export default {
  name: "CreatePost",
  data() {
    return {
      // objet contenant la propriété data pour les champs contenu du post et l'image
      contentPost: {
        content: null,
        postImage: null
      },
      msgError: ""
    };
  },
  computed: {
    ...mapState(["user", "editOption"])
  },
  methods: {
    createPost() {
      console.log(this.contentPost);
      // objet JavaScript 
      const fd = new FormData();
      // ajout des champs
      fd.append("inputFile", this.contentPost.postImage);
      fd.append("content", this.contentPost.content);
      console.log("test récup", fd.get("inputFile"));
      console.log("test récup", fd.get("content"));
      if (fd.get("inputFile") == "null" && fd.get("content") == "null") {
        let msgReturn = document.getElementById('msgReturnAPI')
        msgReturn.classList.add('text-danger')
        this.msgError = "Rien à publier";
      } else {
        // envoi de l'objet data au backend 
        axios
          .post("http://localhost:3000/api/post/create", fd, {
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token")
            }
          })
          .then(response => {
            //Si retour positif de l'API reload de la page pour affichage du dernier post
            if (response) {
              window.location.reload();
            }
          })
          .catch(error => (this.msgError = error));
      }
    },
    // obtention du fichier à partir de l'entrée cible 
    // attribution à la propriété de données postimage
    onFileChange(e) {
      console.log(e);
      this.contentPost.postImage = e.target.files[0] || e.dataTransfer.files;
      console.log(this.contentPost.postImage);
    }
  }
};
</script>

<style>
.input-text {
  width: 100%;
}
</style>