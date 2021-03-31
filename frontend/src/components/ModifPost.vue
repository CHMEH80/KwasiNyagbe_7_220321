<template>
  <div
    class="modal fade"
    id="modalEditPost"
    tabindex="-1"
    role="dialog"
    aria-labelledby="ModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <!--Modification est demandée-->
      <div class="modal-content" v-if="editOption=='modify'">
        <div class="modal-header">
          <h5 class="modal-title" id="ModalLabel">Modifier le post</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form enctype="multipart/form-data" action="/update" method="put">
            <div class="input-group mb-3">
              <label for="input_text">Modifiez votre texte</label>
              <br />
              <textarea class="input-text" id="inputNewText" type="text" :value="post.content"></textarea>
            </div>
            <div class="input-group mb-3" v-if="post.attachement">
              <br />
              <img class="img-thumbnail" :src="post.attachement" />
              <button type="button" class="btn btn-danger mx-auto mt-1" @click='deleteImgAction'>Delete image</button>
            </div>

            <span id="msgReturnAPI" class="mx-3"></span>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
          <button type="button" class="btn btn-primary" @click="updatePost">Save changes</button>
        </div>
      </div>

      <!--Une suppression est demandée-->
      <div class="modal-content" v-else>
        <div class="modal-header">
          <h5 class="modal-title" id="ModalLabel">Supprimer ce post (id: {{post.id}})</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Etes vous sûr de vouloir supprimer ce post</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
          <button type="button" class="btn btn-danger" @click="deletePost">Delete post</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  name: "modalBoxModerate",
  data() {
    return {
      deleteImg: false
    };
  },
  computed: {
    ...mapState(["user", "editOption"])
  },
  props: {
    post: {
      type: Object,
      default() {}
    }
  },
  methods: {
    deletePost() {
      axios
        .delete("http://localhost:3000/api/post/delete", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          data: {
            postId: this.post.id,
            userIdOrder: this.user.userId
          }
        })
        .then(() => {
          window.location.reload();
        })
        .catch(error => console.log(error));
    },

    updatePost() {
      let newInput = document.getElementById("inputNewText").value;
      //Verification si changements existent
      let newContent = false;
      if (newInput !== this.post.content || this.deleteImg != false) {
        newContent = true;
      }
      //Modificiation si changements existent
      if (newContent && this.deleteImg) {
        axios
          .put(
            "http://localhost:3000/api/post/update",
            {
              postId: this.post.id,
              userIdOrder: this.user.userId,
              newText: newInput,
              newImg: null
            },
            {
              headers: {
                authorization: "Bearer " + localStorage.getItem("token")
              }
            }
          )
          .then(response => {
            console.log("reponse API", response);
            this.retourAPI = response.data.confirmation;
            setTimeout(() => {
              this.retourAPI = "";
              // window.location.reload();
            }, 2000);
          })
          .catch(err => {
            console.log("admin", err);
            this.retourAPI = "Une erreur est survenue, vérifier vos saisies";
          })
      } else if(newContent){
        axios
          .put(
            "http://localhost:3000/api/post/update",
            {
              postId: this.post.id,
              userIdOrder: this.user.userId,
              newText: newInput,
            },
            {
              headers: {
                authorization: "Bearer " + localStorage.getItem("token")
              }
            }
          )
          .then(response => {
            console.log("reponse API", response);
            this.retourAPI = response.data.confirmation;
            setTimeout(() => {
              this.retourAPI = "";
              // window.location.reload();
            }, 2000);
          })
          .catch(err => {
            console.log("admin", err);
            this.retourAPI = "Une erreur est survenue, vérifier vos saisies";
          })}
          else{
        console.log("aucun changement");
      }
    },
    deleteImgAction() {
      this.deleteImg = true;
    }
  }
};
</script>

<style>
</style>