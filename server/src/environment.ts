import dotenv from 'dotenv';
import path from 'path';

let dotenvPath = path.resolve(process.cwd(), '.env');

dotenv.config({ path: dotenvPath });

const {
    PORT = '8100',
    PG_CONNECTION_STRING = ''
} = process.env;

const env = {
    PORT,
    PG_CONNECTION_STRING
}

export default env;