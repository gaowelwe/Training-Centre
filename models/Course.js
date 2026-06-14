const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Course = sequelize.define("Course", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fee: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Course.calculateDiscount = function(fee, discountPercentage) {
    return fee - (fee * discountPercentage / 100);
};

module.exports = Course;


