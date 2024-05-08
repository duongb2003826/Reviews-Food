from flask import Flask, jsonify, request
import requests
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from geopy.distance import geodesic
from sklearn.metrics.pairwise import cosine_similarity
import json

app = Flask(__name__)

# Example function to be called via API

df = None

def getDataRestaurant():
    url = 'http://127.0.0.1:5173/api/location/restaurant'
    response = requests.get(url)
    data_res = response.json()
    extracted_data = []
    for entry in data_res:
        extracted_data.append({
            "_id": entry["_id"],
            "averageRating": entry["averageRating"],
            "averageMenu": entry["averageMenu"],
            "latitude": entry["latitude"],
            "longitude": entry["longitude"],
            "locationName": entry["locationName"]
        })
    df = pd.DataFrame(extracted_data)
    return df

def calculate_distance(restaurant_latitude, restaurant_longitude, your_latitude, your_longitude):
    restaurant_location = (restaurant_latitude, restaurant_longitude)
    your_location = (your_latitude, your_longitude)
    distance = geodesic(restaurant_location, your_location).meters
    return distance

def getListRestaurantNearMe(your_latitude, your_longitude):
    df['distance_to_you'] = df.apply(lambda row: calculate_distance(row['latitude'], row['longitude'], your_latitude, your_longitude), axis=1)

    # Filter restaurants within 1000 meters from your location
    nearby_restaurants = df[df['distance_to_you'] <= 1000]
    return nearby_restaurants

# Route to call the add_numbers function
@app.route('/api/recommendation', methods=['GET'])
def api_recommendation_system():
    idRestaurant = request.args.get('idRestaurant', type=str)
    latitudeReq = request.args.get('latitude', type=str)
    longitudeReq = request.args.get('longitude', type=str)
    
    getDataRestaurant()

    dataResponse = getListRestaurantNearMe(latitudeReq,longitudeReq)

    scaler = MinMaxScaler()
    dataResponse[['averageRating', 'averageMenu', 'latitude', 'longitude']] = scaler.fit_transform(dataResponse[['averageRating', 'averageMenu', 'latitude', 'longitude']])

    # Combine the features into a single feature vector
    feature_vector = dataResponse[['averageRating', 'averageMenu', 'latitude', 'longitude']].values
    # Calculate cosine similarity matrix based on the combined feature vector
    similarity_matrix = cosine_similarity(feature_vector)
    
    def recommend_restaurants(restaurant_id, similarity_matrix, n=5):
        # Find index of the restaurant in the DataFrame
        restaurant_index = dataResponse[dataResponse['_id'] == restaurant_id].index[0]
        
        # Get similarity scores for the restaurant
        restaurant_similarities = similarity_matrix[restaurant_index]
        
        # Get indices of top n similar restaurants
        similar_restaurant_indices = restaurant_similarities.argsort()[::-1][1:n+1]
        
        # Get IDs of top n similar restaurants
        similar_restaurant_ids = dataResponse.iloc[similar_restaurant_indices]['_id'].tolist()
        
        return similar_restaurant_ids

    similar_restaurants = recommend_restaurants(idRestaurant, similarity_matrix)

    return jsonify({'result': json.dum(similar_restaurants)})
    # else:
    #     return jsonify({'error': 'Missing parameters'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=8800)
