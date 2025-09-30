// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import BalanceCard from "../component/BalanceCard";
import TransactionTable from "../component/TransactionTable";
import Budgeting from "../component/Budgeting";
import Notifications from "../component/Notifications";

const Dashboard = ({ socket }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  // ✅ Fetch balance + transactions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [balanceRes, txRes] = await Promise.all([
          axios.get("http://localhost:5000/api/balance", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/transactions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setBalance(balanceRes.data.balance || 0);
        setTransactions(txRes.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ Live updates with socket.io
  useEffect(() => {
    if (!socket) return;

    socket.on("balanceUpdated", (newBalance) => {
      setBalance(newBalance);
    });

    socket.on("new_transaction", (tx) => {
      setTransactions((prev) => [tx, ...prev]);
    });

    return () => {
      socket.off("balanceUpdated");
      socket.off("new_transaction");
    };
  }, [socket]);

  return (
    <div className="flex gap-6 min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col">
        <Header />

        <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <BalanceCard balance={balance} socket={socket} />
            <TransactionTable transactions={transactions} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Budgeting />
            <Notifications />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
