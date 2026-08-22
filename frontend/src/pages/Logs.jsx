import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import LogsTable from "../components/LogsTable";
import DetectionDetails from "../components/DetectionDetails";

function Logs() {
  const [logs, setLogs] = useState([]);

  const [search, setSearch] = useState("");
  const [cropFilter, setCropFilter] = useState("all");
  const [threatFilter, setThreatFilter] =
    useState("all");

  const [selectedLog, setSelectedLog] =
    useState(null);

  useEffect(() => {
    const fetchLogs = () => {
      axios
        .get("http://localhost:5000/api/logs",{
          headers:{
             
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setLogs(res.data);
        })
        .catch((err) => {
          console.log(
            "Logs fetch error:",
            err.message
          );
        });
    };

    fetchLogs();

    const interval = setInterval(
      fetchLogs,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {

      const objectName =
        log.object?.toLowerCase() || "";

      const cropName =
        log.crop?.toLowerCase() || "";

      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        objectName.includes(searchText) ||
        cropName.includes(searchText);

      if (!matchesSearch) {
        return false;
      }

      const matchesCrop =
        cropFilter === "all" ||
        cropName === cropFilter;

      if (!matchesCrop) {
        return false;
      }

      const threatLevel = log.harmful
        ? log.threatLevel || "WARNING"
        : "SAFE";

      const matchesThreat =
        threatFilter === "all" ||
        threatLevel === threatFilter;

      return matchesThreat;
    });
  }, [
    logs,
    search,
    cropFilter,
    threatFilter,
  ]);

  const clearFilters = () => {
    setSearch("");
    setCropFilter("all");
    setThreatFilter("all");
  };

  return (
    <div className="logs-page">

      <div className="logs-page-header">

        <div>
          <h1 className="logs-page-title">
            Detection Logs
          </h1>

          <p className="logs-page-subtitle">
            Monitor and review AI detection activity
          </p>
        </div>

        <div className="logs-live-status">
          <span />
          LIVE MONITORING
        </div>

      </div>

      <div className="logs-filter-bar">

        <div className="logs-search">

          <span className="logs-search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search object or crop..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="logs-clear-search"
              onClick={() => setSearch("")}
            >
              ×
            </button>
          )}

        </div>

        <select
          className="logs-filter-select"
          value={cropFilter}
          onChange={(e) =>
            setCropFilter(e.target.value)
          }
        >
          <option value="all">
            All Crops
          </option>

          <option value="wheat">
            Wheat
          </option>

          <option value="rice">
            Rice
          </option>

          <option value="sugarcane">
            Sugarcane
          </option>

          <option value="maize">
            Maize
          </option>
        </select>

        <select
          className="logs-filter-select"
          value={threatFilter}
          onChange={(e) =>
            setThreatFilter(e.target.value)
          }
        >
          <option value="all">
            All Threat Levels
          </option>

          <option value="HIGH">
            High
          </option>

          <option value="WARNING">
            Warning
          </option>

          <option value="SAFE">
            Safe
          </option>
        </select>

        {(search ||
          cropFilter !== "all" ||
          threatFilter !== "all") && (
          <button
            type="button"
            className="logs-clear-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}

      </div>

      <div className="logs-result-summary">

        <span>
          Showing{" "}
          <strong>
            {filteredLogs.length}
          </strong>{" "}
          of{" "}
          <strong>
            {logs.length}
          </strong>{" "}
          records
        </span>

        {filteredLogs.length !==
          logs.length && (
          <span className="logs-filter-active">
            Filters active
          </span>
        )}

      </div>

      <LogsTable
        logs={filteredLogs}
        onSelectLog={setSelectedLog}
      />

      {selectedLog && (
        <DetectionDetails
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}

    </div>
  );
}

export default Logs;