function Topbar({
  crop,
  setCrop
}) {

  return (

    <div className="flex justify-between items-center bg-[#0b1727] p-4 rounded-xl border border-gray-800 shadow-lg">

      <div>

        <h2 className="text-3xl font-bold">
          Smart Surveillance Dashboard
        </h2>

        <p className="text-gray-400 mt-1">
          Real-time crop monitoring system
        </p>

      </div>

      <div className="flex items-center gap-4">

        <select
          value={crop}
          onChange={(e) =>
            setCrop(e.target.value)
          }
          className="bg-[#111f35] p-3 rounded-lg border border-gray-700"
        >

          <option value="rice">
            Rice
          </option>

          <option value="wheat">
            Wheat
          </option>

          <option value="corn">
            Corn
          </option>

        </select>

        <div className="bg-green-500/20 text-green-400 px-5 py-2 rounded-full border border-green-500">

          ● System Active

        </div>

      </div>

    </div>
  );
}

export default Topbar;