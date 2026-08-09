function LogsTable({ logs }) {

  return (

    <div className="bg-[#0b1727] rounded-2xl p-5 border border-gray-800 shadow-lg">

      <h2 className="text-2xl font-semibold mb-5">
        Recent Detection Logs
      </h2>

      <table className="w-full text-left">

        <thead>

          <tr className="border-b border-gray-700 text-gray-400">

            <th className="pb-3">
              Object
            </th>

            <th>
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {logs.map((log, index) => (

            <tr
              key={index}
              className="border-b border-gray-800"
            >

              <td className="py-4">
                {log.object}
              </td>

              <td className={
                log.harmful
                  ? "text-red-400"
                  : "text-green-400"
              }>

                {log.harmful
                  ? "Harmful"
                  : "Safe"}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default LogsTable;