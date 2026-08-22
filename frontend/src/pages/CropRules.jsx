import { useEffect, useState } from "react";
import axios from "axios";

function CropRules() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/crops")
      .then((res) => {
        setCrops(res.data);
      })
      .catch((err) => {
        console.log(
          "Crop rules fetch error:",
          err.message
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const emojiForCrop = (crop) => {
    const map = {
      wheat: "🌾",
      rice: "🌾",
      sugarcane: "🎋",
      maize: "🌽",
    };

    return map[crop?.toLowerCase()] || "🌱";
  };

  return (
    <div className="crop-rules-page">

      {/* HEADER */}

      <div className="crop-rules-header">

        <div>
          <h1 className="crop-rules-title">
            Crop Rules
          </h1>

          <p className="crop-rules-subtitle">
            View the AI protection rules configured
            for each crop
          </p>
        </div>

        <div className="crop-rules-status">
          <span />
          AI RULE ENGINE
        </div>

      </div>

      {/* LOADING */}

      {loading && (
        <div className="crop-rules-loading">
          Loading crop rules...
        </div>
      )}

      {/* EMPTY */}

      {!loading && crops.length === 0 && (
        <div className="crop-rules-empty">
          <div>🌱</div>

          <h2>
            No Crop Rules Found
          </h2>

          <p>
            No crop protection rules are currently
            available in the database.
          </p>
        </div>
      )}

      {/* CROP CARDS */}

      <div className="crop-rules-grid">

        {crops.map((crop) => (

          <div
            className="crop-rule-card"
            key={crop._id || crop.name}
          >

            <div className="crop-rule-card-header">

              <div className="crop-rule-icon">
                {emojiForCrop(crop.name)}
              </div>

              <div>

                <h2 className="crop-rule-name">
                  {crop.name}
                </h2>

                <p>
                  AI protection profile
                </p>

              </div>

            </div>

            {/* HARMFUL */}

            <div className="rule-section">

              <div className="rule-section-header">

                <span className="rule-danger-icon">
                  ⚠
                </span>

                <div>
                  <h3>
                    Harmful Objects
                  </h3>

                  <p>
                    Siren will activate
                  </p>
                </div>

                <span className="rule-count danger">
                  {crop.harmful?.length || 0}
                </span>

              </div>

              <div className="rule-tags">

                {crop.harmful?.length > 0 ? (

                  crop.harmful.map((item) => (
                    <span
                      className="rule-tag harmful"
                      key={item}
                    >
                      {item}
                    </span>
                  ))

                ) : (

                  <span className="rule-none">
                    No harmful objects configured
                  </span>

                )}

              </div>

            </div>

            {/* HARMLESS */}

            <div className="rule-section">

              <div className="rule-section-header">

                <span className="rule-safe-icon">
                  ✓
                </span>

                <div>
                  <h3>
                    Harmless Objects
                  </h3>

                  <p>
                    Detection remains safe
                  </p>
                </div>

                <span className="rule-count safe">
                  {crop.harmless?.length || 0}
                </span>

              </div>

              <div className="rule-tags">

                {crop.harmless?.length > 0 ? (

                  crop.harmless.map((item) => (
                    <span
                      className="rule-tag harmless"
                      key={item}
                    >
                      {item}
                    </span>
                  ))

                ) : (

                  <span className="rule-none">
                    No harmless objects configured
                  </span>

                )}

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default CropRules;