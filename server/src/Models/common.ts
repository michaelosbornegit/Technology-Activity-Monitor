import knex from 'knex';
import env from '../environment';

console.log(env.PG_CONNECTION_STRING);

export default knex({
  client: 'pg',
  connection: env.PG_CONNECTION_STRING,
  searchPath: ['knex', 'public'],
});