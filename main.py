import csv

# Campos del CSV destino
target_fields = [
    "restaurant_name", "latitude", "longitude", "avg_rating"
]

with open('data/tripadvisor_european_restaurants.csv', 'r', encoding='utf-8') as input_file, \
     open('output.csv', 'w', newline='', encoding='utf-8') as output_file:

    reader = csv.DictReader(input_file)
    writer = csv.DictWriter(output_file, fieldnames=target_fields)
    writer.writeheader()

    for row in reader:
        # Extraer los campos necesarios
        new_row = {
            "restaurant_name": row.get('restaurant_name', 'Sin nombre'),
            "latitude": float(row['latitude']) if row.get('latitude') else 0.0,
            "longitude": float(row['longitude']) if row.get('longitude') else 0.0,
            "avg_rating": float(row['avg_rating']) if row.get('avg_rating') else 0.0
        }

        writer.writerow(new_row)

print("Transformación completada!")