// const CarType = require('../models/carType');

// exports.getAllCarTypes = async (req, res) => {
//   try {
//     const carTypes = await CarType.findAll();
//     res.status(200).json(carTypes);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getCarTypeById = async (req, res) => {
//   try {
//     const carType = await CarType.findByPk(req.params.id);
//     if (!carType) return res.status(404).json("CarType not found!");
//     res.status(200).json(carType);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.createCarType = async (req, res) => {
//   try {
//     const carType = await CarType.create(req.body);
//     res.status(201).json(carType);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.updateCarType = async (req, res) => {
//   try {
//     const carType = await CarType.findByPk(req.params.id);
//     if (!carType) return res.status(404).json("CarType not found!");
//     await carType.update(req.body);
//     res.status(200).json({
//       message: "CarType updated",
//       carType
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.deleteCarType = async (req, res) => {
//   try {
//     const carTypeDeleted = await CarType.destroy({ where: { typeId: req.params.id } });
//     if (!carTypeDeleted) return res.status(404).json("CarType not found!");
//     res.status(200).json({ message: "CarType deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
