import firebase_admin
from firebase_admin import credentials, firestore, storage
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# Initialize Firebase Admin SDK
try:
    cred = credentials.Certificate("service.json")  # Replace with the path to your Firebase service account key
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'gs://webparking-c5e59.appspot.com'  # Replace with your Firebase Storage bucket URL
    })
    print("Firebase Admin SDK initialized successfully.")
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")

# Initialize Firestore
firestore_db = firestore.client()
bucket = storage.bucket()  # Initialize Firebase Storage

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def add_parking_lot_firestore(data):
    """
    Add parking lot data to Firestore.
    :param data: A dictionary containing the parking lot data.
    """
    try:
        firestore_db.collection('parking_lots').add(data)
        return "Parking lot data added successfully to Firestore."
    except Exception as e:
        return f"An error occurred in Firestore: {e}"

@app.route('/upload_image', methods=['POST'])
def upload_image():
    """
    Endpoint to upload images to Firebase Storage.
    """
    try:
        file = request.files['file']
        blob = bucket.blob(f"parking_images/{file.filename}")
        blob.upload_from_file(file, content_type=file.content_type)
        blob.make_public()  # Make the file public
        return jsonify({"image_url": blob.public_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/submit_parking_lot', methods=['POST'])
def submit_parking_lot():
    """
    Endpoint to receive parking lot data and upload it to Firebase Firestore.
    """
    try:
        # Parse JSON data from the request
        data = request.get_json()

        # Ensure required fields are provided
        required_fields = ['name', 'price', 'address', 'zone', 'city', 'start_time', 'end_time', 'capacity_car', 'capacity_adapted', 'images']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Prepare the data for Firebase Firestore
        parking_lot_data = {
            'name': data.get('name'),
            'price': float(data.get('price')),
            'address': data.get('address'),
            'zone': data.get('zone'),
            'city': data.get('city'),
            'working_hours': {
                'start': data.get('start_time'),
                'end': data.get('end_time')
            },
            'capacity': {
                'car': int(data.get('capacity_car')),
                'adapted': int(data.get('capacity_adapted'))
            },
            'images': data.get('images')  # Handle uploaded image URLs
        }

        # Upload data to Firestore
        response = add_parking_lot_firestore(parking_lot_data)

        return jsonify({"message": response}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5500)  # You can change the port as needed
