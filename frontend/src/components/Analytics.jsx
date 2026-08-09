function Analytics() {

  return (

    <div className="bg-[#0b1727] rounded-2xl p-5 border border-gray-800 shadow-lg">

      <h2 className="text-2xl font-semibold mb-5">
        Analytics
      </h2>

      <div className="space-y-5">

        <div className="bg-[#111f35] p-4 rounded-xl">

          <p className="text-gray-400">
            Total Detections
          </p>

          <h3 className="text-3xl font-bold mt-2">
            24
          </h3>

        </div>

        <div className="bg-[#111f35] p-4 rounded-xl">

          <p className="text-gray-400">
            Alerts Triggered
          </p>

          <h3 className="text-3xl font-bold mt-2 text-red-400">
            7
          </h3>

        </div>

      </div>

    </div>
  );
}

export default Analytics;