<template>
  <div>
    <div class="block-post">
      <h3>Créer un post</h3>
      <form enctype="multipart/form-data" action="/create" method="post">
        <div class="input-group mb-3">
          <label for="input_text">Racontez nous une incroyable histoire:</label>
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
        <input type="submit" class="btn btn-primary" @click.prevent="createPost" value="Submit" />
        <span id='msgReturnAPI' class="mx-3 text-danger" v-if="user.token==null">Veuillez vous connecter</span>
        <span id='msgReturnAPI' class="mx-3" v-else>{{msgError}}</span>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "CreatePost",
  data() {
    return {
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

      const fd = new FormData();
      fd.append("inputFile", this.contentPost.postImage);
      fd.append("content", this.contentPost.content);
      console.log("test récup", fd.get("inputFile"));
      console.log("test récup", fd.get("content"));
      if (fd.get("inputFile") == "null" && fd.get("content") == "null") {
        let msgReturn = document.getElementById('msgReturnAPI')
        msgReturn.classList.add('text-danger')
        this.msgError = "Rien à publier";
      } else {
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