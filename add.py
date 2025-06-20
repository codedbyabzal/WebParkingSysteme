from flask import Flask, request, render_template, redirect, url_for
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize the Flask app
app = Flask(__name__)

# Path to your Firebase service account key file
cred = credentials.Certificate('path/to/your/service.json')
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# Route for the form page
@app.route('/')
def index():
    return render_template('Add.html')

# Route to handle form submission
@app.route('/submit', methods=['POST'])
def submit_form():
    # Get data from the form
    name = request.form['name']
    price = request.form['price']
    address = request.form['address']
    zone = request.form['zone']
    start_time = request.form['startTime']
    end_time = request.form['endTime']
    capacity_car = request.form['capacityCar']
    capacity_adapted = request.form['capacityAdapted']
    latitude = request.form['latitude']
    longitude = request.form['longitude']

    # Create a dictionary to store parking lot data
    parking_lot_data = {
        'name': name,
        'price': float(price),
        'address': address,
        'zone': zone,
        'workingHours': {
            'start': start_time,
            'end': end_time
        },
        'capacity': {
            'car': int(capacity_car),
            'adapted': int(capacity_adapted)
        },
        'location': {
            'latitude': float(latitude),
            'longitude': float(longitude)
        }
    }

    # Save to Firestore
    try:
        db.collection('parkingLots').add(parking_lot_data)
        return redirect(url_for('index', message='Parking lot added successfully!'))
    except Exception as e:
        return f"An Error Occurred: {str(e)}"

if __name__ == '__main__':
    app.run(debug=True)
