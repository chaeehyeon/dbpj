import React, { useEffect, useState } from "react";
import "./App.css";
import FilterPanel from "./components/FilterPanel";
import ChartAll from "./components/ChartAll";
import ChartClimate from "./components/ChartClimate";
import ChartTemp from "./components/ChartTemp";
import ChartSunlight from "./components/ChartSunlight";
import NicknameInput from "./components/NicknameInput";
import LogViewer from "./components/LogViewer";
import PredictForm from "./components/PredictForm";

function App() {
  const [data, setData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") || ""
  );

  const [rainValue, setRainValue] = useState("");
  const [temperatureValue, setTemperatureValue] = useState("");
  const [sunlightValue, setSunlightValue] = useState("");
  const [volumeValue, setVolumeValue] = useState("");

  useEffect(() => {
    if (!nickname) return;
    fetch(`http://127.0.0.1:5000/api/data?user=${encodeURIComponent(nickname)}`)
      .then((res) => res.json())
      .then((json) => {
        const cleanedData = json.map((row) => ({
          ...row,
          price: Number(row.price),
          volume: Number(row.volume),
          month: row.month,
        }));
        setData(cleanedData);
        setSelectedProduct(cleanedData[0].product);
        setSelectedYear(cleanedData[0].month.slice(0, 4));
        setSelectedMonth(cleanedData[0].month);
      })
      .catch((err) => console.error("API 호출 실패:", err));
  }, [nickname]);

  if (!nickname) {
    return <NicknameInput nickname={nickname} setNickname={setNickname} />;
  }

  if (!data) return <p>데이터 불러오는 중...</p>;

  const allMonths = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  const products = Array.from(new Set(data.map((row) => row.product)));
  const years = Array.from(new Set(data.map((row) => row.month.slice(0, 4))));
  const months = Array.from(
    new Set(
      data
        .filter(
          (row) =>
            row.product === selectedProduct &&
            row.month.startsWith(selectedYear)
        )
        .map((row) => row.month.slice(5, 7).padStart(2, "0"))
    )
  ).sort();

  const target = data.find(
    (row) => row.product === selectedProduct && row.month === selectedMonth
  );
  const filteredData = data.filter(
    (row) => row.product === selectedProduct && row.month === selectedMonth
  );

  const handlePredict = ({
    product,
    rain,
    temperature,
    sunlight,
    volume,
    year,
    month,
  }) => {
    fetch("http://127.0.0.1:5000/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product,
        rain,
        temperature,
        sunlight,
        volume,
        year,
        month,
      }),
    })
      .then((res) => res.json())
      .then((data) =>
        alert("예측 가격: " + Math.round(data.prediction) + "원")
      );
  };

  return (
    <div className="app-container">
      {/* 1. 필터 영역 */}
      <div className="filter-wrapper">
        <div className="filter-panel">
          <FilterPanel
            products={products}
            years={years}
            months={allMonths}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        </div>
      </div>

      {/* 2. 차트 영역 */}
      <div className="charts">
        <div className="card chart-card">
          <ChartAll
            target={target}
            selectedProduct={selectedProduct}
            selectedMonth={selectedMonth}
          />
        </div>
        <div className="card chart-card">
          <ChartClimate
            filteredData={filteredData}
            selectedProduct={selectedProduct}
          />
        </div>
        <div className="card chart-card">
          <ChartTemp
            filteredData={filteredData}
            selectedProduct={selectedProduct}
          />
        </div>
        <div className="card chart-card">
          <ChartSunlight
            filteredData={filteredData}
            selectedProduct={selectedProduct}
          />
        </div>
      </div>

      {/* 3. 로그 뷰어 */}
      <div className="card log-viewer">
        <LogViewer />
      </div>

      {/* 4. 예측 입력폼 */}
      <div className="card predict-form">
        <PredictForm
          selectedProduct={selectedProduct}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          rainValue={rainValue}
          setRainValue={setRainValue}
          temperatureValue={temperatureValue}
          setTemperatureValue={setTemperatureValue}
          sunlightValue={sunlightValue}
          setSunlightValue={setSunlightValue}
          volumeValue={volumeValue}
          setVolumeValue={setVolumeValue}
          handlePredict={handlePredict}
        />
      </div>
    </div>
  );
}

export default App;