# Importamos las librerías necesarias para la API
from http.cookiejar import debug

import pymysql
from flask import Flask, jsonify, request  # Flask para la API y JSON para las respuestas
from flask_cors import CORS  # Permitir solicitudes desde diferentes dominios (CORS)

import config  # Archivo de configuración separado para las credenciales de MySQL

# Inicialización de la aplicación Flask
app = Flask(__name__)

# Habilitar CORS para permitir solicitudes desde otros dominios
CORS(app)

# Configuración de la conexión con MySQL desde un archivo externo 'config.py'
app.config['MYSQL_HOST'] = config.MYSQL_HOST
app.config['MYSQL_USER'] = config.MYSQL_USER
app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = config.MYSQL_DB

# Inicializamos MySQL con la configuración de la aplicación Flask
mysql = pymysql.connect(
    host=app.config['MYSQL_HOST'],
    port=3306,
    user=app.config['MYSQL_USER'],
    passwd=app.config['MYSQL_PASSWORD'],
    db=app.config['MYSQL_DB']
)

# Ruta GET: Obtener todos los usuarios de la base de datos
@app.route('/api/users', methods=['GET'])
def get_users():
    """
    Recupera todos los usuarios de la tabla 'users' y los devuelve como JSON.
    """
    cursor = mysql.cursor()  # Inicializa el cursor
    cursor.execute('SELECT * FROM usuarios')  # Ejecuta la consulta SQL
    users = cursor.fetchall()  # Recupera todas las filas

    # Creamos la lista result usando un bucle for
    result = []
    for user in users:
        result.append({
            'id': user[0],
            'name': user[1],
            'email': user[2]
        })

    return jsonify(result), 200  # Devolvemos el resultado como JSON

# Ruta GET: Obtener un usuario específico por su ID
@app.route('/api/usuarios/<int:id>', methods=['GET'])
def get_user(id):
    """
    Recupera un usuario por su ID.
    """
    cursor = mysql.cursor()  # Inicializa el cursor
    cursor.execute('SELECT * FROM users WHERE id = %s', (id,))  # Consulta SQL con parámetro
    user = cursor.fetchone()  # Obtiene un solo usuario
    if user:
        result = {
            'id': user[0],
            'name': user[1],
            'email': user[2]
        }  # Formato JSON del usuario
        return jsonify(result), 200  # Respuesta con estado 200 si el usuario existe
    return jsonify({'error': 'Usuario no encontrado'}), 404  # Estado 404 si no existe

# Ruta POST: Agregar un nuevo usuario
@app.route('/api/usuarios', methods=['POST'])
def add_user():
    """
    Agrega un nuevo usuario con 'name' y 'email' al sistema.
    """
    data = request.get_json()  # Obtenemos los datos del cuerpo de la solicitud en formato JSON
    name = data.get('name')  # Extraemos el nombre
    email = data.get('email')  # Extraemos el email
    password = data.get('password')

    # Verificamos si los campos necesarios están presentes
    if not name or not email:
        return jsonify({'error': 'Nombre y email son requeridos'}), 400  # Error 400: Solicitud incorrecta

    cursor = mysql.cursor()  # Inicializa el cursor
    cursor.execute('INSERT INTO usuarios (name, email, password) VALUES (%s, %s, %s)', (name, email, password))  # Inserta el nuevo usuario
    mysql.commit()  # Confirma los cambios en la base de datos
    return jsonify({'message': 'Usuario agregado exitosamente'}), 201  # Estado 201: Recurso creado

# Ruta PUT: Actualizar un usuario existente
@app.route('/api/usuarios/<int:id>', methods=['PUT'])
def update_user(id):
    """
    Actualiza los datos de un usuario por su ID.
    """
    data = request.get_json()  # Obtenemos los datos enviados en la solicitud
    name = data.get('name')  # Nuevo nombre
    email = data.get('email')  # Nuevo email

    cursor = mysql.cursor()  # Inicializa el cursor
    cursor.execute('SELECT * FROM users WHERE id = %s', (id,))  # Verificamos si el usuario existe
    user = cursor.fetchone()  # Recupera el usuario
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404  # Error 404 si el usuario no existe

    # Actualizamos el usuario en la base de datos
    cursor.execute('UPDATE usuarios SET name = %s, email = %s WHERE id = %s', (name, email, id))
    mysql.commit()  # Confirmamos los cambios
    return jsonify({'message': 'Usuario actualizado exitosamente'}), 200  # Estado 200: OK

# Ruta DELETE: Eliminar un usuario por ID
@app.route('/api/usuarios/<int:id>', methods=['DELETE'])
def delete_user(id):
    """
    Elimina un usuario por su ID.
    """
    cursor = mysql.cursor()  # Inicializa el cursor
    cursor.execute('SELECT * FROM usuarios WHERE id = %s', (id,))  # Verifica si el usuario existe
    user = cursor.fetchone()  # Recupera el usuario
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404  # Error 404 si no existe

    # Elimina el usuario de la base de datos
    cursor.execute('DELETE FROM usuarios WHERE id = %s', (id,))
    mysql.commit()  # Confirma los cambios
    return jsonify({'message': 'Usuario eliminado exitosamente'}), 200  # Estado 200: OK

# Ruta POST: Login
@app.route('/api/login', methods=['POST'])
def login():
    """
    Agrega un nuevo usuario con 'name' y 'email' al sistema.
    """
    data = request.get_json()  # Obtenemos los datos del cuerpo de la solicitud en formato JSON
    email = data.get('email')  # Extraemos el nombre
    password = data.get('password')  # Extraemos el email

    # Verificamos si los campos necesarios están presentes
    if not email or not password:
        return jsonify({'error': 'Verifique los campos'}), 400  # Error 400: Solicitud incorrecta

    cursor = mysql.cursor()  # Inicializa el cursor
    cursor.execute('SELECT * FROM usuarios WHERE email = %s AND password = %s', (email,password))
    user = cursor.fetchone()  # Recupera el usuario
    if not user:
        return jsonify({'error': 'Verifique la información ingresada'}), 404

    return jsonify({'message': 'Bienvenido'}), 200

# Ruta GET: Obtener todos los productos
@app.route('/api/productos', methods=['GET'])
def get_products():
    cursor = mysql.cursor()
    cursor.execute('SELECT * FROM productos')
    products = cursor.fetchall()

    result = []
    for product in products:
        result.append({
            'id': product[0],
            'name': product[1],
            'price': product[2]
        })

    return jsonify(result), 200

# Ruta GET: Obtener un producto por ID
@app.route('/api/productos/<int:id>', methods=['GET'])
def get_product(id):
    cursor = mysql.cursor()
    cursor.execute('SELECT * FROM productos WHERE id = %s', (id,))
    product = cursor.fetchone()

    if product:
        result = {
            'id': product[0],
            'name': product[1],
            'price': product[2]
        }
        return jsonify(result), 200
    return jsonify({'error': 'Producto no encontrado'}), 404

# Ruta POST: Agregar un nuevo producto
@app.route('/api/productos', methods=['POST'])
def add_product():
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')

    if not name or price is None:
        return jsonify({'error': 'Nombre y precio son requeridos'}), 400

    cursor = mysql.cursor()
    cursor.execute('INSERT INTO productos (name, price) VALUES (%s, %s)', (name, price))
    mysql.commit()
    
    return jsonify({'message': 'Producto agregado exitosamente'}), 201

# Ruta PUT: Actualizar un producto
@app.route('/api/productos/<int:id>', methods=['PUT'])
def update_product(id):
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')

    cursor = mysql.cursor()
    cursor.execute('SELECT * FROM productos WHERE id = %s', (id,))
    product = cursor.fetchone()

    if not product:
        return jsonify({'error': 'Producto no encontrado'}), 404

    cursor.execute('UPDATE productos SET name = %s, price = %s WHERE id = %s', (name, price, id))
    mysql.commit()

    return jsonify({'message': 'Producto actualizado exitosamente'}), 200

# Ruta DELETE: Eliminar un producto
@app.route('/api/productos/<int:id>', methods=['DELETE'])
def delete_product(id):
    cursor = mysql.cursor()
    cursor.execute('SELECT * FROM productos WHERE id = %s', (id,))
    product = cursor.fetchone()

    if not product:
        return jsonify({'error': 'Producto no encontrado'}), 404

    cursor.execute('DELETE FROM productos WHERE id = %s', (id,))
    mysql.commit()

    return jsonify({'message': 'Producto eliminado exitosamente'}), 200

# Punto de entrada de la aplicación
if __name__ == '__main__':
    """
    Ejecuta la aplicación en modo de depuración (debug=True).
    """
    app.run(debug=True, port = 5001)  # Inicia la aplicación Flask
