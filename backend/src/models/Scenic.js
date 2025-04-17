const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Scenic = sequelize.define('Scenic', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    openingHours: {
        type: DataTypes.STRING,
        allowNull: false
    },
    features: {
        type: DataTypes.JSON,
        allowNull: true
    },
    rating: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: true,
        validate: {
            min: 0,
            max: 5
        }
    }
}, {
    timestamps: true
});

module.exports = Scenic; 