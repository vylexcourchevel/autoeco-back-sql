

import { Reservation, Car, User , CarImage } from "../models/index.js";


const createReservation = async (req, res) => {
  const userId = req.user.id;
  // Recuperer CarId
  console.log(req.body);
  const data = {
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    totalPrice: req.body.totalPrice,
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

  const getAllReservations = async (req, res) => {
    
  try {
    const reservations = await Reservation.findAll( {
      include: [
        {model:Car, include: CarImage},
        User
      ]
    });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




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








// // reservationController
// //test de connexion entre User et reservation

// import { Reservation, Car, User } from "../models/index.js";


// const createReservation = async (req, res) => {
//   const userId = req.user.id;
//   const { startDate, endDate, totalPrice, CarId } = req.body;

//   try {
//     // Vérifiez si la voiture existe
//     const car = await Car.findByPk(CarId);
//     if (!car) {
//       return res.status(404).json({ message: "Car not found!" });
//     }

//     const reservation = await Reservation.create({
//       startDate,
//       endDate,
//       totalPrice,
//       UserId: userId,
//       CarId
//     });

//     res.status(201).json(reservation);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // const createReservation = async (req, res) => {
// //   const userId = req.user.id;
// //   // Recuperer CarId
// //   console.log(req.body);
// //   const data = {
// //     startDate: req.body.startDate,
// //     endDate: req.body.endDate,
// //     totalPrice: req.body.totalPrice,
// //     UserId: userId,
// //     CarId: req.body.CarId,


// //   }
// //   try {
// //     const reservation = await Reservation.create(data);
// //     res.status(201).json(reservation);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };

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




// const getReservationById = async (req, res) => {
//   try {
//     const reservation = await Reservation.findByPk(req.params.id, {
//       include: [Car, User]
//     });
//     if (!reservation) return res.status(404).json({ message: "Reservation not found!" });
//     res.status(200).json(reservation);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


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


//   const deleteReservation = async (req, res) => {

//   try {
//     const reservationDeleted = await Reservation.destroy({ where: { id: req.params.id } });
//     //const reservationDeleted = await Reservation.destroy({ where: { reservationID: req.params.id } });
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







// reservationController
// test de connexion entre User et reservation