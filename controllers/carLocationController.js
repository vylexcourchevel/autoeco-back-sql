// const CarLocation = require('../models/carLocation');

// exports.getAllCarLocations = async (req, res) => {
//   try {
//     const carLocations = await CarLocation.findAll();
//     res.status(200).json(carLocations);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getCarLocationById = async (req, res) => {
//   try {
//     const carLocation = await CarLocation.findByPk(req.params.id);
//     if (!carLocation) return res.status(404).json("CarLocation not found!");
//     res.status(200).json(carLocation);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.createCarLocation = async (req, res) => {
//   try {
//     const carLocation = await CarLocation.create(req.body);
//     res.status(201).json(carLocation);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.updateCarLocation = async (req, res) => {
//   try {
//     const carLocation = await CarLocation.findByPk(req.params.id);
//     if (!carLocation) return res.status(404).json("CarLocation not found!");
//     await carLocation.update(req.body);
//     res.status(200).json({
//       message: "CarLocation updated",
//       carLocation
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.deleteCarLocation = async (req, res) => {
//   try {
//     const carLocationDeleted = await CarLocation.destroy({ where: { locationID: req.params.id } });
//     if (!carLocationDeleted) return res.status(404).json("CarLocation not found!");
//     res.status(200).json({ message: "CarLocation deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
