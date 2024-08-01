import  { DataTypes } from 'sequelize';

export default (connection, DataTypes) => {

  const CarImage = connection.define(
    'CarImage',
    {
      // imageID: {
      //   type: DataTypes.INTEGER,
      //   primaryKey: true,
      //   autoIncrement: true
      // },
      imageURL: {
        type: DataTypes.STRING(255)
      }
      // carId: {
      //   type: DataTypes.INTEGER,
      // }
    },
    {
      timestamps: true
    }
  );
}