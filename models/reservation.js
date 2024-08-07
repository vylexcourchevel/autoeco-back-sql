

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
      }, 
      
     { timestamps: true  }
      
    );
  }
  



  

// export default (connection, DataTypes) => {
//   connection.define(
//     'Reservation', 
//     {
//       startDate: {
//           type: DataTypes.DATE
//         },
//         endDate: {
//           type: DataTypes.DATE
//         },
//         totalPrice: {
//           type: DataTypes.DECIMAL(10, 2)
//         },
//         reservationDate: {
//           type: DataTypes.DATE
//         },
//         status: {
//           type: DataTypes.STRING
//         }
//         // carID: {
//         //   type: DataTypes.INTEGER,
//         //   references: {
//         //     model: Car,
//         //     key: 'carID'
//         //   }
//         // }
//       // }, 
//     //   // { timestamps: true  }
//       } 
//     );
//   }
  


// Reservation.belongsTo(Car, { foreignKey: 'carID' });
// Reservation.belongsTo(User, { foreignKey: 'userID' });

// module.exports = Reservation;
