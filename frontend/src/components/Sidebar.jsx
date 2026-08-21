import {
  FaTachometerAlt,
  FaVideo,
  FaHistory,
  FaChartBar
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-[#0b1727] p-6 border-r border-gray-800">
      <h1 className="text-2xl font-bold text-green-400 mb-12">
        🌾 AI Crop Protection
      </h1>
      <ul className="space-y-6">
        <li>
          <Link to="/" className="flex items-center gap-3 text-lg hover:text-green-400 cursor-pointer transition-all">
            <FaTachometerAlt />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/" className="flex items-center gap-3 text-lg hover:text-green-400 cursor-pointer transition-all">
            <FaVideo />
            Live Monitor
          </Link>
        </li>
        <li>
          <Link to="/logs" className="flex items-center gap-3 text-lg hover:text-green-400 cursor-pointer transition-all">
            <FaHistory />
            Logs
          </Link>
        </li>
        <li>
          <Link to="/" className="flex items-center gap-3 text-lg hover:text-green-400 cursor-pointer transition-all">
            <FaChartBar />
            Analytics
          </Link>
        </li>
      </ul>
    </div>
  );
}
export default Sidebar;