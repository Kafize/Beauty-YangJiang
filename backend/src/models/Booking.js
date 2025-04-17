const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('ticket', 'hotel'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending'
    },
    // 门票预订相关字段
    ticketName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    visitDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1
        }
    },
    // 酒店预订相关字段
    hotelName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    checkInDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    checkOutDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    roomCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1
        }
    },
    guestCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1
        }
    },
    // 通用字段
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    bookingDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    validate: {
        validateBookingType() {
            if (this.type === 'ticket') {
                if (!this.ticketName || !this.visitDate || !this.quantity) {
                    throw new Error('门票预订必须包含门票名称、游玩日期和数量');
                }
            } else if (this.type === 'hotel') {
                if (!this.hotelName || !this.checkInDate || !this.checkOutDate || !this.roomCount || !this.guestCount) {
                    throw new Error('酒店预订必须包含酒店名称、入住日期、退房日期、房间数和人数');
                }
            }
        }
    }
});

module.exports = Booking; 