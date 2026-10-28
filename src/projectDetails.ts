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
  // Add measured values only with the dataset/split or other evaluation context.
  metrics: { label: string; value: string; context: string }[];
}

export const projectDetails: Record<string, ProjectEvidence> = {
  "PhishLens — NLP-Assisted Phishing Analysis": {
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
  "SentinelAI — Hybrid Intrusion Detection System": {
    repositoryUrl: "",
    demoUrl: "",
    screenshots: [],
    challenge: "Detecting both known and unseen attacks while balancing detection rates and false positives.",
    outcome: "Research in progress: combining supervised classification, deep learning and anomaly detection. Benchmark results are not available yet.",
    metrics: [],
  },
};
