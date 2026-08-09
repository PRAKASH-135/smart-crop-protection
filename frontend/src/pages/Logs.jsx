import { useEffect, useState } from "react";
import axios from "axios";

function Logs() {

  const [logs, setLogs] =
    useState([]);

  useEffect(() => {

    axios
      .get("http://localhost:5000/api/logs")

      .then(res => {
        setLogs(res.data);
      });

  }, []);

  return (

    <div className="p-6 text-white">

      <h1 className="text-3xl font-bold mb-6">

        Detection Logs

      </h1>

      <table className="w-full">

        <thead>

          <tr className="border-b border-gray-700">

            <th>Object</th>
            <th>Crop</th>
            <th>Status</th>
            <th>Confidence</th>

          </tr>

        </thead>

        <tbody>

          {logs.map((log) => (

            <tr
              key={log._id}
              className="border-b border-gray-800"
            >

              <td>{log.object}</td>

              <td>{log.crop}</td>

              <td>

                {log.harmful
                  ? "Harmful"
                  : "Safe"}

              </td>

              <td>

                {(log.confidence * 100)
                  .toFixed(1)}%

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Logs;