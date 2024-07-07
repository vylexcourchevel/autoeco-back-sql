// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
// const Car = require('./car');
// const User = require('./user');



export default (connection, DataTypes) => {
  connection.define(
    'Reservation', 
    {
      startDate: {
          type: DataTypes.DATE
        },
        endDate: {
          type: DataTypes.DATE
        },
        totalPrice: {
          type: DataTypes.DECIMAL(10, 2)
        },
        reservationDate: {
          type: DataTypes.DATE
        },
        status: {
          type: DataTypes.STRING
        }
        // carID: {
        //   type: DataTypes.INTEGER,
        //   references: {
        //     model: Car,
        //     key: 'carID'
        //   }
        // }
      // }, 
    //   // { timestamps: true  }
      } 
    );
  }
  


  // reservationID: {
  //   type: DataTypes.INTEGER,
  //   primaryKey: true,
  //   autoIncrement: true
  // },
  // startDate: {
  //   type: DataTypes.DATE
  // },
  // endDate: {
  //   type: DataTypes.DATE
  // },
  // totalPrice: {
  //   type: DataTypes.DECIMAL(10, 2)
  // },
  // reservationDate: {
  //   type: DataTypes.DATE
  // },
  // status: {
  //   type: DataTypes.STRING
  // }
  // carID: {
  //   type: DataTypes.INTEGER,
  //   references: {
  //     model: Car,
  //     key: 'carID'
  //   }
  // }
  // userID: {
  //   type: DataTypes.INTEGER,
  //   references: {
  //     model: User,
  //     key: 'userID'
  //   }
  // }
// });

// Reservation.belongsTo(Car, { foreignKey: 'carID' });
// Reservation.belongsTo(User, { foreignKey: 'userID' });

// module.exports = Reservation;
