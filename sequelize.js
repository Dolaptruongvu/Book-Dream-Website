const { Sequelize } = require("sequelize");
const databaseName = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASSWORD;
const host = process.env.DATABASE_HOST;
const port = process.env.DATABASE_PORT;

// console.log('Connecting to Database:');
// console.log(`Database: ${databaseName}`);
// console.log(`Username: ${username}`);
// console.log(`Host: ${host}`);
// console.log(`Port: ${port}`);

const sequelize = new Sequelize(databaseName, username, password, {
  host: host,
  port: port,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // For self-signed certificates
    },
  },
  logging: false,
}); 


sequelize.sync({ force: false }) // Set force: true to drop and recreate the table each time (useful for development)
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((err) => {
    console.error('Unable to create the database & tables:', err);
  });
 

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
