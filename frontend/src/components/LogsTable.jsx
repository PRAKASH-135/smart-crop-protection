function LogsTable({ logs }) {

  const emojiFor = (obj) => {
    const map = {
      person: "🧑", cow: "🐄", monkey: "🐒", elephant: "🐘",
      pig: "🐖", goat: "🐐", bird: "🐦", dog: "🐕", none: "—"
    };
    return map[obj?.toLowerCase()] || "❓";
  };

  return (
    <div className="bg-[#0b1727] rounded-2xl p-5 border border-gray-800 shadow-lg">
      <h2 className="text-2xl font-semibold mb-5">
        Recent Detection Logs
      </h2>

      {logs.length === 0 ? (
        <p className="text-gray-500 text-sm">No detections yet.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-sm">
              <th className="pb-3">Object</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Siren</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr
                key={index}
                className="border-b border-gray-800"
              >
                <td className="py-3 flex items-center gap-2">
                  <span className="text-xl">{emojiFor(log.object)}</span>
                  <span className="capitalize">{log.object}</span>
                </td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    log.harmful
                      ? "bg-red-500/20 text-red-400 border border-red-500/40"
                      : "bg-green-500/20 text-green-400 border border-green-500/40"
                  }`}>
                    {log.harmful ? "Harmful" : "Safe"}
                  </span>
                </td>
                <td className="py-3">
                  {log.harmful ? (
                    <span className="text-red-400">🔔</span>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default LogsTable;