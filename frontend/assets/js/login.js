window.onload = async function (){
    let status = localStorage.getItem("login");
    if (status === "ok") {
        location.href = "crud.html";
    }
}

document.getElementById("btn-login").addEventListener("click", async function () {
    let inputEmail = document.getElementById("email-user");
    let inputPassword = document.getElementById("password-user");

     // Validar si los campos están vacíos
     if (inputName.value.trim().length <= 0 || inputEmail.value.trim().length <= 0 || inputPassword.value.trim() <= 0) {
        messageDiv.textContent = "Complete los campos";  // Mostrar el mensaje de error
        return false;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "email": inputEmail.value,
        "password": inputPassword.value,
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://127.0.0.1:5001/api/login", requestOptions)
        .then((response) => response.json())
        .then((result) => {

            if (result.message === "Bienvenido") {
                localStorage.setItem("login", "ok");

                // redirecciona a otra pagina
               location.href = "crud.html";

            }else{
                alert(result.message)
            }

        })
        .catch((error) => console.error(error));


})