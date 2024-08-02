

export default (connection, DataTypes) => {

  connection.define(
        
      'User',
            {
            // userID: {
            //   type: DataTypes.INTEGER,
            //   primaryKey: true,
            //   autoIncrement: true
            // },
            firstName: {
              type: DataTypes.STRING(150),
              allowNull: false
            },
            lastName: {
              type: DataTypes.STRING(150),
              allowNull: false
            },
            email: {
              type: DataTypes.STRING(250),
              unique: true
            },
            password: {
              type: DataTypes.STRING(250),
            
          },
            address: {
              type: DataTypes.STRING(250),
              allowNull: false
            },
            phoneNumber: {
              type: DataTypes.STRING
            },
            isAdmin: {
              type: DataTypes.BOOLEAN,
              defaultValue: false
            }
          },
            
          {
            timestamps: true
          }

     );
};


// // models/user.js
// import { DataTypes } from 'sequelize';
//  import sequelize from '../config/database.js';

// const User = sequelize.define('User', {
//     firstName: {
//         type: DataTypes.STRING(150),
//         allowNull: false
//     },
//     lastName: {
//         type: DataTypes.STRING(150),
//         allowNull: false
//     },
//     email: {
//         type: DataTypes.STRING(250),
//         unique: true
//     },
//     password: {
//         type: DataTypes.STRING(250),
//     },
//     address: {
//         type: DataTypes.STRING(250),
//         allowNull: false
//     },
//     phoneNumber: {
//         type: DataTypes.STRING
//     }
// }, {
//     timestamps: true
// });

// export default User;