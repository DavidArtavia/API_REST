import 'dotenv/config'
import pg from 'pg'
const { Pool, Client } = pg


const credentials = {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    database: process.env.DATABASE,
}
const connectionString = `postgresql://${credentials.username}:${credentials.password}@${credentials.host}/${credentials.database}`

export const pool = new Pool({
    allowExitOnIdle: true, // se cierra automaticamente si no hay conexiones
    connectionString,
})

try {
    await pool.query('SELECT NOW()')
    console.log('Connected to the database');

} catch (error) {
console.log('Error connecting to the database', error);

}

