// const Sequelize = require("sequelize");
const DataTypes = require("sequelize");
const sequelize = require("../config/databaseConnection");

const Users = sequelize.define("Users", {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    fname:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    lname:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    age:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Users;