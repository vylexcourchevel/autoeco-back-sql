//test de connexion entre User et reservation

import { Reservation, Car, User } from "../models/index.js";

const createReservation = async (req, res) => {
  const userId = req.user.id;
  // Recuperer CarId
  console.log(req.body);
  const data = {
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    UserId: userId,
    CarId: req.body.CarId,

  }
  try {
    const reservation = await Reservation.create(data);
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//exports.getAllReservations = async (req, res) => {
  const getAllReservations = async (req, res) => {
    
  try {
    const reservations = await Reservation.findAll({
      include: User
    });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//exports.getReservationById = async (req, res) => {

  const getReservationById = async (req, res) => {

  try {
    const reservation = await Reservation.findByPk(req.params.id, {
      include: [Car, User]
    });
    if (!reservation) return res.status(404).json("Reservation not found!");
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  const updateReservation = async (req, res) => {

  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json("Reservation not found!");
    await reservation.update(req.body);
    res.status(200).json({
      message: "Reservation updated",
      reservation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


  const deleteReservation = async (req, res) => {

  try {
    const reservationDeleted = await Reservation.destroy({ where: { reservationID: req.params.id } });
    if (!reservationDeleted) return res.status(404).json("Reservation not found!");
    res.status(200).json({ message: "Reservation deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation
}








// import { Reservation, Car, User } from "../models/index.js";

// const createReservation = async (req, res) => {

//   try {
//     const reservation = await Reservation.create(req.body);
//     res.status(201).json(reservation);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// //exports.getAllReservations = async (req, res) => {
//   const getAllReservations = async (req, res) => {
    
//   try {
//     const reservations = await Reservation.findAll({
//       include: [Car, User]
//     });
//     res.status(200).json(reservations);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// //exports.getReservationById = async (req, res) => {

//   const getReservationById = async (req, res) => {

//   try {
//     const reservation = await Reservation.findByPk(req.params.id, {
//       include: [Car, User]
//     });
//     if (!reservation) return res.status(404).json("Reservation not found!");
//     res.status(200).json(reservation);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // exports.createReservation = async (req, res) => {



// //exports.updateReservation = async (req, res) => {

//   const updateReservation = async (req, res) => {

//   try {
//     const reservation = await Reservation.findByPk(req.params.id);
//     if (!reservation) return res.status(404).json("Reservation not found!");
//     await reservation.update(req.body);
//     res.status(200).json({
//       message: "Reservation updated",
//       reservation
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// //exports.deleteReservation = async (req, res) => {

//   const deleteReservation = async (req, res) => {

//   try {
//     const reservationDeleted = await Reservation.destroy({ where: { reservationID: req.params.id } });
//     if (!reservationDeleted) return res.status(404).json("Reservation not found!");
//     res.status(200).json({ message: "Reservation deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export {
//   getAllReservations,
//   getReservationById,
//   createReservation,
//   updateReservation,
//   deleteReservation
// }


