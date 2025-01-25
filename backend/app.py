from flask import Flask, send_from_directory, request, jsonify
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId  # Importar el módulo bson


# Cargar las variables de entorno desde el archivo .env
load_dotenv()

app = Flask(__name__)

# Configuración de MongoDB
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_database()
users_collection = db.users

# Ruta para servir el HTML principal
@app.route('/<filename>')
def serve_component(filename):
    components_folder = os.path.join(os.getcwd(), 'frontend', 'views')
    return send_from_directory(components_folder, filename)

# Ruta personalizada para servir archivos estáticos (como JS)
@app.route('/frontend/components/<filename>')
def serve_cdn(filename):
    static_folder = os.path.join(os.getcwd(), 'frontend', 'components')
    return send_from_directory(static_folder, filename, mimetype="application/javascript")

# Ruta para probar la conexión a la base de datos (opcional)
@app.route('/test-db')
def test_connection():
    try:
        collection_names = db.list_collection_names()
        return f"Conexión exitosa. Colecciones: {collection_names}", 200
    except Exception as e:
        return f"Error conectando a la base de datos: {str(e)}", 500
    
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Extraer los campos de datos
        nombre = data.get('nombre')
        apellido = data.get('apellido')
        email = data.get('email')
        password = data.get('password')
        
        # Validar que los campos no estén vacíos
        if not nombre or not apellido or not email or not password:
            return jsonify({'message': 'Todos los campos son requeridos'}), 400
        
        # Aquí puedes agregar más validaciones, como verificar el formato del email
        
        # Hash de la contraseña antes de almacenarla
        hashed_password = generate_password_hash(password)
        
        # Insertar el nuevo usuario en la base de datos
        user = {
            'nombre': nombre,
            'apellido': apellido,
            'email': email,
            'password': hashed_password
        }
        
        # Verificar si el correo ya está registrado
        if users_collection.find_one({"email": email}):
            return jsonify({'message': 'El correo ya está registrado'}), 400
        
        # Insertar el usuario en MongoDB
        users_collection.insert_one(user)
        
        # Responder con un mensaje de éxito
        return jsonify({'message': 'Registro exitoso'}), 200
    
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500
    
@app.route('/login', methods=['POST'])
def login():
    try:
        # Obtener los datos del cuerpo de la solicitud
        data = request.get_json()

        # Extraer los campos de datos
        email = data.get('email')
        password = data.get('password')

        # Verificar si el usuario existe en la base de datos
        user = users_collection.find_one({"email": email})
        
        if user:
            # Verificar la contraseña utilizando check_password_hash
            if check_password_hash(user['password'], password):
                # Convertir ObjectId a string antes de devolverlo
                user['_id'] = str(user['_id'])
                return jsonify({'message': 'Inicio de sesión exitoso', 'user': user}), 200
            else:
                return jsonify({'message': 'Contraseña incorrecta'}), 400
        else:
            return jsonify({'message': 'Usuario no encontrado'}), 404

    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/asesorias', methods=['GET'])
def get_asesorias():
    try:
        # Obtener todas las asesorías de la base de datos
        asesorias = db.asesorias.find()  # find() obtiene todos los documentos
        
        # Convertir los datos a un formato JSON que el frontend pueda manejar
        asesorias_list = []
        for asesoria in asesorias:
            # Convertir el ObjectId a string antes de enviarlo
            asesorias_list.append({
                "id": str(asesoria["_id"]),  # Agregar ID como string
                "tema": asesoria["tema"],
                "fecha": asesoria["fecha"],
                "usuario": asesoria["tutor"],  # Asumiendo que el "tutor" es el solicitante
                "horas": asesoria["hora"],
            })
        
        # Devolver los datos como JSON
        return jsonify(asesorias_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/asesoria/<id>', methods=['GET'])
def get_asesoria_by_id(id):
    try:
        # Buscar la asesoría por su ID
        asesoria = db.asesorias.find_one({"_id": ObjectId(id)})
        
        if asesoria:
            # Convertir el ObjectId a string antes de enviarlo
            asesorias_data = {
                "id": str(asesoria["_id"]),
                "tema": asesoria["tema"],
                "fecha": asesoria["fecha"],
                "usuario": asesoria["tutor"],  # Asumiendo que el "tutor" es el solicitante
                "horas": asesoria["hora"],
                "notas": asesoria["notas"]
            }
            return jsonify(asesorias_data), 200
        else:
            return jsonify({"error": "Asesoría no encontrada"}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
@app.route('/solicitar-asesoria', methods=['POST'])
def solicitar_asesoria():
    try:
        data = request.json
        tema = data.get("tema")
        fecha = data.get("fecha")
        hora = data.get("hora")
        notas = data.get("notas")
        tutor = data.get("tutor")

        # Validación extra (opcional)
        if not tema or not fecha or not hora or not tutor:
            return jsonify({"error": "Todos los campos son obligatorios"}), 400
        if len(notas) > 50:
            return jsonify({"error": "Las notas no pueden superar los 50 caracteres"}), 400
        if int(hora) < 1 or int(hora) > 8:
            return jsonify({"error": "Las horas deben estar entre 1 y 8"}), 400

        # Guardar en la base de datos
        asesoria = {
            "tema": tema,
            "fecha": fecha,
            "hora": int(hora),
            "notas": notas,
            "tutor": tutor,
        }
        db.asesorias.insert_one(asesoria)

        return jsonify({"message": "Asesoría guardada con éxito"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/asesoria/<asesoriaId>', methods=['PUT'])
def update_asesoria(asesoriaId):
    try:
        # Obtener los datos del cuerpo de la solicitud
        data = request.json
        tema = data.get("tema")
        fecha = data.get("fecha")
        hora = data.get("hora")
        notas = data.get("notas")
        tutor = data.get("tutor")

        # Validación extra (opcional)
        if not tema or not fecha or not hora or not tutor:
            return jsonify({"error": "Todos los campos son obligatorios"}), 400
        if len(notas) > 50:
            return jsonify({"error": "Las notas no pueden superar los 50 caracteres"}), 400
        if int(hora) < 1 or int(hora) > 8:
            return jsonify({"error": "Las horas deben estar entre 1 y 8"}), 400

        # Buscar la asesoría por ID
        asesoria = db.asesorias.find_one({"_id": ObjectId(asesoriaId)})

        if not asesoria:
            return jsonify({"error": "Asesoría no encontrada"}), 404

        # Actualizar los campos de la asesoría
        updated_asesoria = {
            "tema": tema,
            "fecha": fecha,
            "hora": int(hora),
            "notas": notas,
            "tutor": tutor
        }

        # Actualizar la asesoría en la base de datos
        db.asesorias.update_one({"_id": ObjectId(asesoriaId)}, {"$set": updated_asesoria})

        return jsonify({"message": "Asesoría actualizada con éxito"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/asesoria/<asesoria_id>', methods=['DELETE'])
def delete_asesoria(asesoria_id):
    try:
        # Intentamos eliminar el documento de la base de datos
        result = db.asesorias.delete_one({"_id": ObjectId(asesoria_id)})

        if result.deleted_count == 0:
            return jsonify({"message": "Asesoría no encontrada"}), 404

        return jsonify({"message": "Asesoría eliminada exitosamente"}), 200
    except Exception as e:
        return jsonify({"message": f"Error al eliminar la asesoría: {str(e)}"}), 500    
    
    

if __name__ == '__main__':
    app.run(debug=True)
