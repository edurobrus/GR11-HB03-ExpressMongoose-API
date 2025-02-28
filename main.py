import csv

# Rutas de los archivos
ltlg_file = 'ltlg.csv'
user_file = 'User.csv'
output_file = 'UserTotal.csv'

# Leer los datos de los archivos CSV
with open(user_file, mode='r', encoding='utf-8') as user_csv:
    # Leer los usuarios y contraseñas
    user_reader = csv.DictReader(user_csv)
    user_data = [row for row in user_reader]

# Verificar el número de filas en User.csv
num_users = len(user_data)

# Leer las primeras N filas de ltlg.csv sin el campo id
with open(ltlg_file, mode='r', encoding='utf-8') as ltlg_csv:
    ltlg_reader = csv.DictReader(ltlg_csv)
    
    # Filtramos solo latitude y longitude, ignorando id
    ltlg_data = [{'latitude': row['latitude'], 'longitude': row['longitude']} for row in ltlg_reader]

    # Cortar ltlg_data a la misma cantidad de filas que user_data
    ltlg_data = ltlg_data[:num_users]

# Verificar que ahora ambos archivos tengan la misma cantidad de filas
if len(ltlg_data) != len(user_data):
    print("❌ Error: Los archivos no tienen la misma cantidad de filas.")
    exit(1)

# Combinar los datos en un solo archivo CSV
with open(output_file, mode='w', encoding='utf-8', newline='') as output_csv:
    fieldnames = ['username', 'password', 'latitude', 'longitude']
    writer = csv.DictWriter(output_csv, fieldnames=fieldnames)

    # Escribir el encabezado
    writer.writeheader()

    # Escribir las filas combinadas
    for user_row, ltlg_row in zip(user_data, ltlg_data):
        # Combinamos los datos de cada fila
        combined_row = {
            'username': user_row['username'],
            'password': user_row['password'],
            'latitude': ltlg_row['latitude'],
            'longitude': ltlg_row['longitude'],
        }
        writer.writerow(combined_row)

print(f"✅ Archivo {output_file} creado exitosamente.")
