import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const {Pool} = pg; //Vamos usar uma Pool em vez de um Client pois assim podemos fazer varias conexoes e pedidos ao mesmo tempo sem ter de esperar pelo termo dos outros

const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT
})

export default pool;