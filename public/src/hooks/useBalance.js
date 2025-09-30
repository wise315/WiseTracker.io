import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../services/socket";

export const useBalance = () => {
  const [balance, setBalance] = useState(0);

  // Fetch balance once on load
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await API.get("/balance");
        setBalance(res.data.balance);
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    };
    fetchBalance();
  }, []);

  // Update balance when new transaction arrives
  useEffect(() => {
    socket.on("new_transaction", (tx) => {
      setBalance((prev) => prev + parseFloat(tx.amount));
    });
    return () => socket.off("new_transaction");
  }, []);

  return { balance, setBalance };
};
