import mysql from 'mysql2/promise';

export async function getConnection() {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'inventario_rdv_db', // Cambia por el nombre de tu base de datos
  });
}