import { translate, type Language } from "./i18n";

const features = [
  "Phishing email classification and risk assessment.",
  "Analysis of email content, sender information, and suspicious URLs.",
  "Detection of social-engineering indicators.",
  "LLM-generated explanations and security recommendations.",
  "Comparison and evaluation of ML and Transformer-based models.",
  "Interactive dashboard for email analysis and results visualization.",
];
const tools = ["Python", "Scikit-learn", "Hugging Face Transformers", "LLMs", "PyTorch", "Pandas", "NLTK / spaCy", "FastAPI", "Streamlit", "Git / GitHub"];

export default function PhishGuardProjectDetails({ language }: { language: Language }) {
  const t = (text: string) => translate(text, language);
  return <div className="work-contribution">
    <h4>{t("Project description")}</h4>
    <p>{t("PhishGuard LLM is an AI-powered cybersecurity system designed to detect and analyze phishing emails using Natural Language Processing (NLP), Machine Learning, Deep Learning, and Large Language Models (LLMs). The system aims to classify emails, identify suspicious content and social-engineering techniques, and generate understandable, evidence-based explanations with security recommendations.")}</p>
    <p>{t("The project will explore the integration of traditional classification models and Transformer-based architectures with an LLM explanation layer to improve the interpretability of phishing detection results.")}</p>
    <h4>{t("Planned key features")}</h4>
    <ul>{features.map(feature => <li key={feature}>{t(feature)}</li>)}</ul>
    <h4>{t("Technologies & Tools")}</h4>
    <div className="work-tags">{tools.map(tool => <span key={tool}>{tool}</span>)}</div>
    <p>{t("Proposed stack: tools will be selected as development progresses.")}</p>
    <h4>{t("Current status")}</h4>
    <p>{t("Planned / In Progress")}. {t("The features and technology choices above describe the intended scope; implementation and evaluation are still in progress.")}</p>
  </div>;
}
