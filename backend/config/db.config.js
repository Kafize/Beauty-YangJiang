module.exports = {
  host: "localhost",
  user: "root",
  password: "WYYC10YEAR",
  database: "yangjiang_tourism",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
