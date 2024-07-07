// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

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
            }
          },

          {
            timestamps: true
          }

     );
};

// module.exports = User;
