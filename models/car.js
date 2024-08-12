import { DataTypes } from 'sequelize';

export default (sequelize, DataTypes) => {
  const Car = sequelize.define(
    'Car',
    {
      brand: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      model: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      registrationPlate: {
        type: DataTypes.STRING(50),
        allowNull: false,
       // unique: true,
      },
      years: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pricePerDay: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      available: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
    },
    {
      // Options de modèle Sequelize (si nécessaire)
    }
  );

  // Définissez les relations avec d'autres modèles si nécessaire
  // Car.belongsTo(CarType, { foreignKey: 'typeId' });
  // Car.belongsTo(CarLocation, { foreignKey: 'locationID' });

 
};

