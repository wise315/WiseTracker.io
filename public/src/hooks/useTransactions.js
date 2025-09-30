import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../services/socket";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  // Fetch initial transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await API.get("/transactions");
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };
    fetchTransactions();
  }, []);

  // Listen for new transactions in real-time
  useEffect(() => {
    socket.on("new_transaction", (tx) => {
      setTransactions((prev) => [tx, ...prev]);
    });
    return () => socket.off("new_transaction");
  }, []);

  return { transactions, setTransactions };
};
