// const Payment = require('../models/payment');
// const Reservation = require('../models/reservation');
import { Payment, Reservation } from "../models/index.js";

//exports.getPaymentById = async (req, res) => {
//exports.createPayment = async (req, res) => {
  export const createPayment = async (req, res) => {
    try {
      const payment = await Payment.create(req.body);
      res.status(201).json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// exports.getAllPayments = async (req, res) => {
  export const getAllPayments = async (req, res) => {
    
  try {
    const payments = await Payment.findAll({
      include: [Reservation]
    });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//exports.updatePayment = async (req, res) => {
  export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json("Payment not found!");
    await payment.update(req.body);
    res.status(200).json({
      message: "Payment updated",
      payment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//exports.deletePayment = async (req, res) => {
  export const deletePayment = async (req, res) => {

  try {
    const paymentDeleted = await Payment.destroy({ where: { paymendID: req.params.id } });
    if (!paymentDeleted) return res.status(404).json("Payment not found!");
    res.status(200).json({ message: "Payment deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPaymentById = async (req, res) => {
    
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [Reservation]
    });
    if (!payment) return res.status(404).json("Payment not found!");
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

