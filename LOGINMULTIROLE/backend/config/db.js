import { Sequelize } from "sequelize";

const db = new Sequelize('authdb2', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;