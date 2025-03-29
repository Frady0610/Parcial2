document.addEventListener("DOMContentLoaded", function () {
    readAll(); // Cargar productos al inicio

    // Capturar evento del formulario
    document.getElementById("productForm").addEventListener("submit", function (event) {
        event.preventDefault();
        create();
    });

    // Botón de cerrar sesión
    document.getElementById("logout-btn").addEventListener("click", function () {
        logout();
    });
});

const URL = "http://127.0.0.1:5001/api/productos/";
let editingProductId = null; // Para saber si se está editando un producto

// CREATE: Agregar un producto
function create() {
    const name = document.getElementById("productName").value.trim();
    const price = document.getElementById("productPrice").value.trim();

    if (!name || !price) {
        alert("Todos los campos son obligatorios");
        return;
    }

    fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price })
    })
    .then(response => response.json())
    .then(() => {
        console.log("Producto agregado con éxito");
        readAll();
        document.getElementById("productForm").reset();
    })
    .catch(error => console.error("Error al agregar producto:", error));
}

// READ ALL: Obtener todos los productos
function readAll() {
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            console.log("Productos obtenidos:", data);
            const tableBody = document.getElementById("productTable");
            tableBody.innerHTML = ""; // Limpiar tabla

            data.forEach(product => {
                const row = document.createElement("tr");
                
                row.innerHTML = `
                    <th scope="row">${product.id}</th>
                    <td>${product.name}</td>
                    <td>$${product.price}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="loadProduct(${product.id}, '${product.name}', ${product.price})">Editar</button>
                        <button class="btn btn-sm btn-danger ms-2" onclick="delete_( ${product.id} )">Eliminar</button>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error al obtener productos:", error));
}

// READ ONE: Obtener un solo producto
function readOne(id) {
    fetch(URL + id)
        .then(response => response.json())
        .then(product => {
            console.log("Producto encontrado:", product);
            alert(`Producto: ${product.name}\nPrecio: $${product.price}`);
        })
        .catch(error => console.error("Error al obtener el producto:", error));
}

// Cargar datos en el formulario para editar
function loadProduct(id, name, price) {
    document.getElementById("productName").value = name;
    document.getElementById("productPrice").value = price;
    editingProductId = id;
}

// UPDATE: Actualizar un producto
function update_() {
    if (!editingProductId) {
        alert("No hay producto seleccionado para actualizar");
        return;
    }

    const name = document.getElementById("productName").value.trim();
    const price = document.getElementById("productPrice").value.trim();

    if (!name || !price) {
        alert("Todos los campos son obligatorios");
        return;
    }

    fetch(URL + editingProductId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price })
    })
    .then(response => response.json())
    .then(() => {
        console.log("Producto actualizado con éxito");
        readAll();
        document.getElementById("productForm").reset();
        editingProductId = null;
    })
    .catch(error => console.error("Error al actualizar producto:", error));
}

// DELETE: Eliminar un producto
function delete_(id) {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    fetch(URL + id, { method: "DELETE" })
        .then(() => {
            console.log("Producto eliminado con éxito");
            readAll();
        })
        .catch(error => console.error("Error al eliminar producto:", error));
}

// Cerrar sesión
function logout() {
    fetch("http://127.0.0.1:5001/logout", { method: "POST" })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            window.location.href = "login.html"; // Redirigir a login
        })
        .catch(error => console.error("Error al cerrar sesión:", error));
}
