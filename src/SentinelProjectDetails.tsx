import { translate, type Language } from "./i18n";

const completed = [
  ["Data preparation & analysis", "Cleaned CIC-IDS2017 traffic records, handled missing and infinite values, removed duplicates, and explored class distributions and attack categories."],
  ["Baseline models", "Developed and evaluated Random Forest and XGBoost classifiers for malicious traffic detection."],
  ["Deep learning experiments", "Explored CNN, LSTM and CNN-LSTM architectures for network traffic classification; validation is ongoing."],
  ["Evaluation workflow", "Organized notebook-based experiments for preprocessing, training and comparison using accuracy, precision, recall, F1-score and classification reports."],
];

const planned = [
  ["Anomaly detection", "Develop an Autoencoder-based component to investigate unusual traffic and previously unseen threats."],
  ["Real-time data streaming", "Integrate Apache Kafka to transport network-flow events to the detection pipeline."],
  ["Automated inference", "Process incoming events and generate predictions and anomaly scores."],
  ["Backend API", "Develop a Flask API to expose detection results and manage alerts."],
  ["Interactive dashboard", "Build a React interface displaying traffic statistics, attack categories, suspicious events, and detection history."],
  ["Live traffic integration", "Investigate network-flow extraction and live monitoring after validating the streaming pipeline."],
];

export default function SentinelProjectDetails({ language }: { language: Language }) {
  const t = (text: string) => translate(text, language);
  const list = (items: string[][]) => <ul>{items.map(([label, text]) => <li key={label}><strong>{t(label)}:</strong> {t(text)}</li>)}</ul>;

  return <div className="work-contribution">
    <h4>{t("Project Overview")}</h4>
    <p>{t("SentinelAI explores how machine learning and deep learning can identify malicious network traffic. Using CIC-IDS2017, the project compares supervised classifiers and neural architectures, with anomaly detection planned to investigate threats beyond the attack categories seen during training.")}</p>
    <h4>{t("Work completed")}</h4>
    {list(completed)}
    <h4>{t("Work in progress")}</h4>
    <ul>
      <li>{t("Finalizing and validating CNN, LSTM and CNN-LSTM experiments.")}</li>
      <li>{t("Comparing all models using consistent data splits and evaluation metrics.")}</li>
      <li>{t("Designing experiments to evaluate detection of attack categories excluded from supervised training.")}</li>
    </ul>
    <h4>{t("Planned features")}</h4>
    {list(planned)}
    <h4>{t("Preliminary experiment")}</h4>
    <p>{t("XGBoost reached approximately 99.30% test accuracy in one CIC-IDS2017 experiment. This preliminary score remains subject to validation of the data split, evaluation protocol and per-class performance.")}</p>
    <h4>{t("Expected Outcome")}</h4>
    <p>{t("A modular research prototype connecting traffic classification, anomaly detection and security monitoring. Current work focuses on offline model validation; streaming, API, dashboard and live traffic capabilities form the future roadmap.")}</p>
  </div>;
}
