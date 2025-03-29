document.addEventListener("DOMContentLoaded", function () {
    fetchProducts(); 

    
    document.getElementById("productForm").addEventListener("submit", function (event) {
        event.preventDefault();
        saveProduct();
    });

   
    document.getElementById("logout-btn").addEventListener("click", function () {
        logout();
    });
});

let editingProductId = null;


function fetchProducts() {
    fetch("/api/productos")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("productTable");
            tableBody.textContent = ""; 

            data.forEach(product => {
                const row = document.createElement("tr");
                
                const idCell = document.createElement("th");
                idCell.scope = "row";
                idCell.textContent = product.id;
                row.appendChild(idCell);
                
                const nameCell = document.createElement("td");
                nameCell.textContent = product.name;
                row.appendChild(nameCell);
                
                const priceCell = document.createElement("td");
                priceCell.textContent = `$${product.price}`;
                row.appendChild(priceCell);
                
                const actionTd = document.createElement("td");
                
                const editBtn = document.createElement("button");
                editBtn.className = "btn btn-sm btn-warning";
                editBtn.textContent = "Editar";
                editBtn.addEventListener("click", () => loadProductForEdit(product));
                
                const deleteBtn = document.createElement("button");
                deleteBtn.className = "btn btn-sm btn-danger ms-2";
                deleteBtn.textContent = "Eliminar";
                deleteBtn.addEventListener("click", () => deleteProduct(product.id));
                
                actionTd.appendChild(editBtn);
                actionTd.appendChild(deleteBtn);
                row.appendChild(actionTd);
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error al obtener productos:", error));
}


function saveProduct() {
    const name = document.getElementById("productName").value.trim();
    const price = document.getElementById("productPrice").value.trim();

    if (!name || !price) {
        alert("Todos los campos son obligatorios");
        return;
    }

    const url = editingProductId ? `/api/productos/${editingProductId}` : "/api/productos";
    const method = editingProductId ? "PUT" : "POST";

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price })
    })
    .then(response => response.json())
    .then(() => {
        fetchProducts();
        document.getElementById("productForm").reset();
        editingProductId = null;
    })
    .catch(error => console.error("Error al guardar producto:", error));
}


function loadProductForEdit(product) {
    document.getElementById("productName").value = product.name;
    document.getElementById("productPrice").value = product.price;
    editingProductId = product.id;
}


function deleteProduct(id) {
    fetch(`/api/productos/${id}`, { method: "DELETE" })
        .then(() => fetchProducts())
        .catch(error => console.error("Error al eliminar producto:", error));
}

function logout() {
    fetch("/logout", { method: "POST" })
        .then(() => {
            alert("Sesión cerrada");
            window.location.href = "/login";
        })
        .catch(error => console.error("Error al cerrar sesión:", error));
}
