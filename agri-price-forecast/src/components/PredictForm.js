// components/PredictForm.js
import React from "react";

function PredictForm({
  selectedProduct,
  selectedYear,
  selectedMonth,
  rainValue,
  setRainValue,
  temperatureValue,
  setTemperatureValue,
  sunlightValue,
  setSunlightValue,
  volumeValue,
  setVolumeValue,
  handlePredict,
}) {
  return (
    <div style={{ margin: 20 }}>
      <h3>예측용 입력값</h3>
      <label>
        강수량:
        <input
          value={rainValue}
          onChange={(e) => setRainValue(e.target.value)}
          style={{ marginRight: 10 }}
        />
      </label>
      <label>
        기온:
        <input
          value={temperatureValue}
          onChange={(e) => setTemperatureValue(e.target.value)}
          style={{ marginRight: 10 }}
        />
      </label>
      <label>
        일조량:
        <input
          value={sunlightValue}
          onChange={(e) => setSunlightValue(e.target.value)}
          style={{ marginRight: 10 }}
        />
      </label>
      <label>
        거래량:
        <input
          value={volumeValue}
          onChange={(e) => setVolumeValue(e.target.value)}
          style={{ marginRight: 10 }}
        />
      </label>
      <button
        onClick={() =>
          handlePredict({
            product: selectedProduct,
            rain: Number(rainValue),
            temperature: Number(temperatureValue),
            sunlight: Number(sunlightValue),
            volume: Number(volumeValue),
            year: Number(selectedYear),
            month: Number(selectedMonth),
          })
        }
      >
        예측하기
      </button>
    </div>
  );
}

export default PredictForm;
