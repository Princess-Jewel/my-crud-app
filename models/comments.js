// const Sequelize = require("sequelize");
const DataTypes = require("sequelize");
const sequelize = require("../config/databaseConnection");

const Comments = sequelize.define("Comments", {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    comment:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    postId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

module.exports = Comments;