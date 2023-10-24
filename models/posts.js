// const Sequelize = require("sequelize");
const DataTypes = require("sequelize");
const sequelize = require("../config/databaseConnection");

const Posts = sequelize.define("Posts", {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    content:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

module.exports = Posts;