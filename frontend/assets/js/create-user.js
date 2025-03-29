document.getElementById("btn-register").addEventListener("click", async function () {
    let inputName = document.getElementById("name-user");
    let inputEmail = document.getElementById("email-user");
    let inputPassword = document.getElementById("password-user");
    let messageDiv = document.getElementById("message"); // Agregado para mostrar el mensaje

    // Validar si los campos están vacíos
    if (inputName.value.trim().length <= 0 || inputEmail.value.trim().length <= 0 || inputPassword.value.trim() <= 0) {
        messageDiv.textContent = "Complete los campos";  // Mostrar el mensaje de error
        return false;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "name": inputName.value,
        "email": inputEmail.value,
        "password": inputPassword.value,
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        let response = await fetch("http://127.0.0.1:5001/api/usuarios", requestOptions);
        if (!response.ok) {
            messageDiv.textContent = "Error al registrar. Intente nuevamente."; // Mensaje en caso de error
            console.log("Error en la request");
            return false;
        }

        let result = await response.json(); // Obtener la respuesta
        if (result.message) {
            messageDiv.textContent = result.message; // Mostrar el mensaje de éxito o error
        }

        if (result.message === "Usuario agregado exitosamente") {
            location.href = "crud.html"; // Redirigir si el registro fue exitoso
        }

        return true;
    } catch (error) {
        messageDiv.textContent = "Error de conexión."; // Mensaje en caso de error en la conexión
        console.log("Error en la request");
        return false;
    }
});
