import csv

# Campos originales del CSV (según los datos de ejemplo)
input_fields = ["Country", "City", "AccentCity", "Region", "Population", "Latitude", "Longitude"]

# Campos de salida modificados
target_fields = ["city_name", "latitude", "longitude"]

with open('data/City.csv', 'r', encoding='utf-8') as input_file, \
     open('output.csv', 'w', newline='', encoding='utf-8') as output_file:

    reader = csv.DictReader(input_file, fieldnames=input_fields)
    next(reader)  # Saltar header si ya está incluido en el CSV
    writer = csv.DictWriter(output_file, fieldnames=target_fields)
    writer.writeheader()

    for row in reader:
        # Mapeo y transformación de datos
        new_row = {
            "city_name": row['AccentCity'],  # Usamos el nombre acentuado
            "latitude": float(row['Latitude']) if row['Latitude'] else 0.0,
            "longitude": float(row['Longitude']) if row['Longitude'] else 0.0
        }

        writer.writerow(new_row)

print("Transformación completada!")