//Récupération de la liste des posts
getPost = () => {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var response = JSON.parse(this.responseText);
            console.log(response);
        }
    };
    request.open("GET", "http://localhost:3000/api/post");
    request.send();
}

/*
var request = new XMLHttpRequest();
request.open("POST", "http://url-service-web.com/api/users");
request.setRequestHeader("Content-Type", "application/json");
request.send(JSON.stringify(jsonBody));*/