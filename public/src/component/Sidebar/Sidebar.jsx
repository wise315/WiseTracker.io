import { useState } from "react";
import { Home, PieChart, Send, CreditCard, BarChart2, User } from "lucide-react";

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    { label: "Dashboard", icon: Home },
    { label: "Portfolio", icon: PieChart },
    { label: "Transactions", icon: Send },
    { label: "Transfer", icon: CreditCard },
    { label: "Payments", icon: CreditCard },
    { label: "Budgeting", icon: BarChart2 },
  ];

  return (
    <aside
      className={`bg-white shadow-sm h-screen p-4 flex flex-col transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Profile Placeholder */}
      <div className="mb-6 flex justify-center">
        <div
          className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          <User size={24} />
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.label;
            return (
              <li
                key={item.label}
                onClick={() => setActive(item.label)}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                {isOpen && <span className="font-medium">{item.label}</span>}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
