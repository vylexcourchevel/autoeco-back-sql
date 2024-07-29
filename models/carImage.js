import  { DataTypes } from 'sequelize';
// const sequelize = require('../config/database');
// const Car = require('./car');

export default (connection, DataTypes) => {

const CarImage = connection.define(
'CarImage',
{
  imageID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  imageURL: {
    type: DataTypes.STRING(255)
  }
//   carID: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: Car,
//       key: 'carID'
    // }
  }

);
{
  timestamps: true


};
}


// CarImage.belongsTo(Car, { foreignKey: 'carID' });

// module.exports = CarImage;
