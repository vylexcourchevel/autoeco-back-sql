const Car = require('../models/car');
const CarType = require('../models/carType');
const CarLocation = require('../models/carLocation');

exports.getAllCars = async (req, res) => {

  // const carImageObject = JSON.parse(req.body.thing);
  // delete thingObject._id;
  // delete thingObject._userId;
  // const thing = new Thing ({
  //   ...thingObject,
  //   userId: req.auth.userId,
  //   imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  // }

  // );

  try {
    const cars = await Car.findAll({
      include: [CarType, CarLocation]
    });
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id, {
      include: [CarType, CarLocation]
    });
    if (!car) return res.status(404).json("Car not found!");
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) return res.status(404).json("Car not found!");
    await car.update(req.body);
    res.status(200).json({
      message: "Car updated",
      car
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const carDeleted = await Car.destroy({ where: { carID: req.params.id } });
    if (!carDeleted) return res.status(404).json("Car not found!");
    res.status(200).json({ message: "Car deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
