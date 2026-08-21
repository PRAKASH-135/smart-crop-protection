function Topbar({
  crop,
  setCrop
}) {

  const crops = [
    { id: "wheat", label: "Wheat", sub: "Field Crop", emoji: "🌾" },
    { id: "rice", label: "Rice", sub: "Paddy Crop", emoji: "🍚" },
    { id: "corn", label: "Corn", sub: "Field Crop", emoji: "🌽" },
    { id: "tomato", label: "Tomato", sub: "Garden Crop", emoji: "🍅" }
  ];

  return (
    <div className="space-y-4">

      <div className="flex justify-between items-center bg-[#0b1727] p-4 rounded-xl border border-gray-800 shadow-lg">
        <div>
          <h2 className="text-3xl font-bold">
            AI Crop Protection
          </h2>
          <p className="text-gray-400 mt-1">
            Intelligent Intrusion Alert System
          </p>
        </div>
        <div className="bg-green-500/20 text-green-400 px-5 py-2 rounded-full border border-green-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
          System Active
        </div>
      </div>

      <div className="bg-[#0b1727] p-5 rounded-xl border border-gray-800 shadow-lg">
        <h3 className="text-lg font-semibold mb-1">Select Crop</h3>
        <p className="text-gray-400 text-sm mb-4">Choose the crop you want to monitor</p>
        <div className="grid grid-cols-4 gap-4">
          {crops.map((c) => (
            <button
              key={c.id}
              onClick={() => setCrop(c.id)}
              className={`relative rounded-xl p-5 text-center border transition-all ${
                crop === c.id
                  ? "border-green-500 bg-green-500/10"
                  : "border-gray-700 bg-[#111f35] hover:border-gray-500"
              }`}
            >
              {crop === c.id && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 text-black text-xs flex items-center justify-center">
                  ✓
                </span>
              )}
              <div className={`mb-3 mx-auto w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                crop === c.id ? "bg-green-500/20" : "bg-gray-700/40"
              }`}>
                {c.emoji}
              </div>
              <div className="font-semibold">{c.label}</div>
              <div className="text-xs text-gray-400">{c.sub}</div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
export default Topbar;