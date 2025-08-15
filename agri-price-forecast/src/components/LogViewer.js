// components/LogViewer.js
import React, { useEffect, useState } from "react";

function LogViewer() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/log")
      .then((res) => res.json())
      .then((json) => setLogs(json.reverse()));
  }, []);

  const formatTime = (time) => {
    const t = new Date(time);
    return t.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ fontWeight: "bold" }}>최근 사용 내역</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 240, overflowY: "auto" }}>
        {logs.length === 0 ? (
          <span style={{ color: "#888" }}>최근 조회 기록이 없습니다.</span>
        ) : (
          logs.map((log, idx) => (
            <div
              key={idx}
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: "10px 18px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.09)",
                fontSize: 14,
                color: "#222",
                borderLeft: "4px solid",
              }}
            >
              <div>
                <b>{formatTime(log.time)}</b>에 조회함
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LogViewer;
