

export default (connection, DataTypes) => {
  connection.define(
  'Payment', 
  {

  amount: {
    type: DataTypes.DECIMAL(15, 2)
  },
  paymentDate: {
    type: DataTypes.DATE
  },
  paymentMethod: {
    type: DataTypes.STRING(50)
  },

  }, 
{
  timestamps: true
}
 
  );
}





// // const { DataTypes } = require('sequelize');
// // const sequelize = require('../config/database');
// // const Reservation = require('./reservation');

// export default (connection, DataTypes) => {
//   connection.define(
//   'Payment', 
//   {
//   // paymendID: {
//   //   type: DataTypes.INTEGER,
//   //   primaryKey: true,
//   //   autoIncrement: true
//   // },
//   amount: {
//     type: DataTypes.DECIMAL(15, 2)
//   },
//   paymentDate: {
//     type: DataTypes.DATE
//   },
//   paymentMethod: {
//     type: DataTypes.STRING(50)
//   },
//   // reservationID: {
//   //   type: DataTypes.INTEGER,
//   //   // references: {
//   //   //   model: Reservation,
//   //   //   key: 'reservationID'
//   //   // }
//   }, 
// {
//   timestamps: true
// }
 
//   );
// }


//  //Payment.belongsTo(Reservation, { foreignKey: 'reservationID' });

// // module.exports = Payment;
