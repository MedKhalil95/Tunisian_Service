from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import math
from services_data import SERVICES, CATEGORIES, SUBCATEGORIES

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Haversine formula to calculate distance between two coordinates
def calculate_distance(lat1, lon1, lat2, lon2):
    # Convert to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Radius of earth in kilometers
    r = 6371
    
    return c * r

@app.route('/')
def index():
    return render_template('index.html')
@app.route('/api/services', methods=['GET'])
def get_services():
    try:
        # Change default to Tunis, Tunisia
        user_lat = float(request.args.get('lat', 36.8065))  # Tunis coordinates
        user_lon = float(request.args.get('lon', 10.1815))
        category = request.args.get('category', 'all')
        max_distance = float(request.args.get('max_distance', 10))  # Default 10km
        # ... rest of the function remains the same
        
        # Filter services by category
        if category == 'all':
            filtered_services = SERVICES.copy()
        else:
            filtered_services = [s for s in SERVICES if s['category'] == category]
        
        # Calculate distance for each service
        for service in filtered_services:
            distance = calculate_distance(
                user_lat, user_lon,
                service['latitude'], service['longitude']
            )
            service['distance'] = round(distance, 2)
        
        # Filter by max distance and sort by distance
        nearby_services = [
            s for s in filtered_services 
            if s['distance'] <= max_distance
        ]
        nearby_services.sort(key=lambda x: x['distance'])
        
        return jsonify({
            'success': True,
            'services': nearby_services,
            'categories': CATEGORIES,
            'subcategories': SUBCATEGORIES,
            'user_location': {'lat': user_lat, 'lon': user_lon},
            'total_found': len(nearby_services)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/categories', methods=['GET'])
def get_categories():
    return jsonify({
        'success': True,
        'categories': CATEGORIES,
        'subcategories': SUBCATEGORIES
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)