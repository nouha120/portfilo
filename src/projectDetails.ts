export interface ProjectScreenshot {
  // Path relative to public/, for example projects/sentinel-network/confusion-matrix.png.
  src: string;
  alt: string;
  caption: string;
}

export interface ProjectEvidence {
  repositoryUrl: string;
  demoUrl: string;
  screenshots: ProjectScreenshot[];
  challenge: string;
  outcome: string;
  evaluationNote?: string;
  sections?: { title: string; items: string[] }[];
  // Add measured values only with the dataset/split or other evaluation context.
  metrics: { label: string; value: string; context: string }[];
}

export const projectDetails: Record<string, ProjectEvidence> = {
  "PhishGuard LLM": {
    repositoryUrl: "",
    demoUrl: "",
    screenshots: [],
    challenge: "Planned focus: recognising misleading language while keeping false positives low and preventing untrusted email text from steering LLM instructions.",
    outcome: "Just started: defining the dataset, baseline and evaluation plan. No trained model, deployed demo or measured results are available yet.",
    metrics: [],
  },
  "SentinelAI — Network Intrusion Detection": {
    repositoryUrl: "https://github.com/nouha120/SentinelAI",
    demoUrl: "",
    screenshots: [
      { src: "projects/image3.png", alt: "Confusion matrix at decision threshold 0.10", caption: "Confusion matrix at threshold 0.10: 8,775 true negatives, 936 false positives, 1,808 false negatives and 11,025 true positives." },
      { src: "projects/image2.png", alt: "Random Forest ROC curve on the official test set", caption: "Official test set: the Random Forest ROC curve reports an AUC of 0.96." },
      { src: "projects/image1.png", alt: "Feature importance chart for the intrusion detection model", caption: "Feature importance: source bytes and destination bytes are the two highest-ranked variables in this figure." },
      { src: "projects/image4.png", alt: "Validation precision, recall and false-positive rate across decision thresholds", caption: "Validation threshold trade-off. These validation curves are separate from the official test-set results." },
    ],
    challenge: "Handling class imbalance and choosing a detection threshold while comparing Logistic Regression and Random Forest.",
    outcome: "Offline NSL-KDD classification with Random Forest and Logistic Regression pipelines. Uploaded evaluation figures include official test-set ROC and confusion-matrix results, feature importance and validation threshold comparisons. This is not a real-time production detector.",
    metrics: [{ label: "ROC AUC", value: "0.96", context: "Random Forest · official test set · reported in the uploaded ROC figure" }],
  },
  "SentinelAI — A Real-Time Hybrid Intrusion Detection System for Known and Unseen Cyberattacks": {
    repositoryUrl: "https://github.com/nouha120/SentinelAI-A-Real-Time-Hybrid-Intrusion-Detection-System-for-Known-and-Unseen-Cyberattacks",
    demoUrl: "",
    screenshots: [],
    evaluationNote: "Random Forest and XGBoost baselines have been evaluated. CNN, LSTM and CNN-LSTM validation and comparisons on consistent data splits are in progress; final benchmark scores are not published here yet.",
    challenge: "Compare supervised and deep learning models using consistent data splits, then investigate whether anomaly detection can identify attack categories excluded from supervised training while keeping false alarms under control.",
    outcome: "Under development, with offline AI experiments as the current focus. The objective is a modular intrusion detection prototype combining supervised models, anomaly detection and streaming technologies for security monitoring. The Kafka pipeline, API, dashboard and live traffic integration remain planned until implemented and tested.",
    sections: [
      { title: "Work in progress", items: [
        "Finalizing and validating CNN, LSTM and CNN-LSTM experiments.",
        "Comparing all models using consistent data splits and evaluation metrics.",
        "Developing an Autoencoder-based anomaly detection component.",
        "Designing experiments with attack categories excluded from supervised training.",
      ] },
      { title: "Planned features", items: [
        "Apache Kafka streaming to transport network-flow events to the detection pipeline.",
        "Automated inference to generate predictions and anomaly scores from incoming events.",
        "A Flask API to expose detection results and manage security alerts.",
        "A React dashboard for traffic statistics, attack categories, suspicious events and detection history.",
        "Network-flow extraction and live monitoring after validating the streaming pipeline.",
      ] },
    ],
    metrics: [],
  },
};
