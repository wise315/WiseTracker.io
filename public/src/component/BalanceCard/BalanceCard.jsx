import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BalanceCard = () => {
  const [balance, setBalance] = useState(0); // start at 0
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // 👇 Fetch balance when component loads
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/balance", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBalance(res.data.balance); // update state with backend value
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch balance");
      }
    };

    fetchBalance();
  }, []); // empty deps → run once on mount

  const handleTransfer = async () => {
    if (!amount || isNaN(amount)) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/transfer",
        { description: "Manual Transfer", amount: parseFloat(amount) },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // use backend response instead of guessing
      setBalance(res.data.balance);

      setAmount("");
      setShowModal(false);
      toast.success("Transfer successful!");
      console.log("Transfer result:", res.data);
    } catch (err) {
      console.error(err);
      toast.error("Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm">
        <div>
          <p className="text-gray-600">Account Balance</p>
          <p className="text-2xl font-bold">${balance.toLocaleString()}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gray-800 text-white px-4 py-2 rounded-md"
        >
          Transfer Funds
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 animate-fade-in">
            <h2 className="text-lg font-bold mb-4">Transfer Funds</h2>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border w-full p-2 rounded mb-4"
              placeholder="Enter amount"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {loading ? "Transferring..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BalanceCard;
