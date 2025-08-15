import streamlit as st
import pandas as pd
import pickle

@st.cache_resource
def load_model():
    with open("model.pkl", "rb") as f:
        model = pickle.load(f)
    return model

model = load_model()
st.title("농산물 가격 예측 및 시각화")

# 단일 예측
with st.form("예측입력"):
    st.subheader("단일 예측 입력")
    PDLT_NM = st.text_input("품목명 (예: 배추)", "배추")
    AMNT_RAIN = st.number_input("강수량", value=0.0)
    AVG_TEMP_C = st.number_input("평균기온", value=0.0)
    total_SunL = st.number_input("일조량", value=0.0)
    Quantity = st.number_input("거래물량", value=0)
    PRCE_REG_YMD = st.text_input("날짜(YYYYMMDD)", "20240621")
    submit = st.form_submit_button("예측")
    if submit:
        input_df = pd.DataFrame([{
            "PRCE_REG_YMD": PRCE_REG_YMD,
            "PDLT_NM": PDLT_NM,
            "AMNT_RAIN": AMNT_RAIN,
            "AVG_TEMP_C": AVG_TEMP_C,
            "total_SunL": total_SunL,
            "Quantity": Quantity,
        }])
        # 필요하다면 연도, 월 추가 생성
        input_df["YEAR"] = input_df["PRCE_REG_YMD"].str[:4].astype(int)
        input_df["MONTH"] = input_df["PRCE_REG_YMD"].str[4:6].astype(int)
        # feature 순서는 모델에 맞게!
        features = ["PDLT_NM", "AMNT_RAIN", "AVG_TEMP_C", "total_SunL", "Quantity", "YEAR", "MONTH"]
        pred = model.predict(input_df[features])[0]
        st.success(f"예측가격: {pred:.2f} 원")

st.markdown("---")

# 파일 업로드 일괄 예측
st.subheader("CSV 파일 업로드 (일괄 예측)")
file = st.file_uploader("CSV 업로드", type=["csv"])
if file:
    df = pd.read_csv(file)
    st.write("업로드 데이터", df.head())
    # 연도, 월 컬럼 생성
    df["YEAR"] = df["PRCE_REG_YMD"].astype(str).str[:4].astype(int)
    df["MONTH"] = df["PRCE_REG_YMD"].astype(str).str[4:6].astype(int)
    features = ["PDLT_NM", "AMNT_RAIN", "AVG_TEMP_C", "total_SunL", "Quantity", "YEAR", "MONTH"]
    try:
        df["예측가격"] = model.predict(df[features])
        st.write("예측 결과", df.head())
        # 실제값 비교 그래프
        if "PDLT_PRCE" in df.columns:
            st.line_chart(df[["PDLT_PRCE", "예측가격"]])
        else:
            st.line_chart(df["예측가격"])
        # 다운로드 버튼
        csv = df.to_csv(index=False).encode('utf-8-sig')
        st.download_button("예측결과 CSV 다운로드", csv, "prediction.csv", "text/csv")
    except Exception as e:
        st.error(f"예측 실패: {e}")
else:
    st.info("컬럼명: PRCE_REG_YMD,PDLT_CODE,PDLT_NM,AMNT_RAIN,AVG_TEMP_C,total_SunL,Quantity,PDLT_PRCE")
