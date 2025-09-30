
import React from "react";

const TransactionTable = ({ transactions }) => {
  return (
    <div className="p-6 bg-white rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      <ul className="divide-y">
        {transactions.map((tx) => (
          <li key={tx.id} className="py-3 flex justify-between">
            <span>{tx.description}</span>
            <span className="font-bold">${tx.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionTable;
