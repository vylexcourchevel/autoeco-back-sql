// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
// const Car = require('./car');

// const CarImage = sequelize.define('CarImage', {
//   imageID: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   imageURL: {
//     type: DataTypes.STRING(255)
//   },
//   carID: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: Car,
//       key: 'carID'
//     }
//   }
// });

// CarImage.belongsTo(Car, { foreignKey: 'carID' });

// module.exports = CarImage;
