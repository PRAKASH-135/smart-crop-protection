import {
  FaTachometerAlt,
  FaVideo,
  FaHistory,
  FaChartBar
} from "react-icons/fa";

function Sidebar() {

  return (

    <div className="w-64 bg-[#0b1727] p-6 border-r border-gray-800">

      <h1 className="text-2xl font-bold text-green-400 mb-12">
        🌾 AI Crop Protection
      </h1>

      <ul className="space-y-6">

        <li className="flex items-center gap-3 text-lg hover:text-green-400 cursor-pointer transition-all">

          <FaTachometerAlt />
          Dashboard

        </li>

        <li className="flex items-center gap-3 text-lg hover:text-green-400 cursor-pointer transition-all">

          <FaVideo />
          Live Monitor

        </li>

        <li className="flex items-center gap-3 text-lg hover:text-green-400 cursor-pointer transition-all">

          <FaHistory />
          Logs

        </li>

        <li className="flex items-center gap-3 text-lg hover:text-green-400 cursor-pointer transition-all">

          <FaChartBar />
          Analytics

        </li>

      </ul>

    </div>
  );
}

export default Sidebar;