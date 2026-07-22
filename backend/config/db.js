import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const {Pool, types} = pg; //Vamos usar uma Pool em vez de um Client pois assim podemos fazer varias conexoes e pedidos ao mesmo tempo sem ter de esperar pelo termo dos outros
types.setTypeParser(1114, (val) => val); //Remove horas de inverno, fica tempo universalizado
types.setTypeParser(1184, (val) => val); //Remove horas de verao, fica tempo universalizado

export const pool = new Pool(
    process.env.DATABASE_URL
        ? {
              connectionString: process.env.DATABASE_URL,
              ssl: {
                  rejectUnauthorized: false
              }
          }
        : {
              host: process.env.PGHOST,
              user: process.env.PGUSER,
              password: process.env.PGPASSWORD,
              database: process.env.PGDATABASE,
              port: process.env.PGPORT
          }
);

export default pool;