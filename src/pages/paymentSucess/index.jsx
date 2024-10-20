import React, { useEffect, useState } from "react";
import { viewPaymentResult } from "../../Services/PayOSApi";
import { UpdatePaymentSubscriptionStatus } from "../../Services/paymentApi";
import styles from "./../../pages/paymentSucess/style.module.scss";
import logo from '../../assets/logo.png';



const PaymentSuccess = () => {
  const [orderResult, setOrderResult] = useState({});
  const queryParams = new URLSearchParams(window.location.search);
  const orderCode = queryParams.get("orderCode");

  useEffect(() => {
    if (orderCode) {
      fetchOrderDetails(orderCode);
    }
  }, [orderCode]);

  const fetchOrderDetails = async (orderCode) => {
    try {
      const response = await viewPaymentResult(orderCode);
      if (response.data.isSuccess) {
        setOrderResult(response.data.data); // Accessing the data field
        const currStatus = response.data.data.status === "PAID" ? "Paid" : "Unpaid";
        handleUpdateStatusOfPayment(orderCode, currStatus);
      }
    } catch (error) {
      console.error("Error details:", error.response ? error.response.data : error);
      console.log("Failed to load order details information", error);
    }
  };

  const handleUpdateStatusOfPayment = async (paymentId, paymentStatus) => {
    try {
      await UpdatePaymentSubscriptionStatus(paymentId, paymentStatus);
    } catch (error) {
      console.log("Fail to update payment status", error);
    }
  };

  const { status, amount, amountPaid, amountRemaining, createdAt } = orderResult;
  const isPaid = status === "PAID";

return (
  <div className={styles.paymentSuccess}>
    <img src={logo} alt="Logo" className={styles.logoImage} /> {/* Logo outside the payment card */}
    <div className={styles.paymentCard}>
      <h2 className={styles.title}>Receiptify</h2>
      <div className={styles.paymentInfo}>
        <p><strong>Payment information:</strong></p>
        <p>Payment Status: <span className={isPaid ? styles.paid : styles.cancelled}>{isPaid ? "Successful" : "Cancelled"}</span></p>
        <p>Order Information: {orderCode}</p>
        <p>Amount: {new Intl.NumberFormat('vi-VN').format(amount)} VND</p>
        <p>Amount Paid: {new Intl.NumberFormat('vi-VN').format(amountPaid)} VND</p>
        <p>Amount Remaining: {new Intl.NumberFormat('vi-VN').format(amountRemaining)} VND</p>
        <p>Created At: {new Date(createdAt).toLocaleString('vi-VN')}</p>
      </div>
    </div>
    <div className={styles.messageContainer}>
      <h1 className={styles.message}>
        {isPaid ? "Thank you for your purchase!" : "Your order was cancelled."}
      </h1>
    </div>
  </div>
);

};

export default PaymentSuccess;
