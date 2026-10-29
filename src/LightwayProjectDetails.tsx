import { translate, type Language } from "./i18n";

const features = [
  ["AI-powered task verification", "Combined YOLOv8 object detection, FLAN-T5 text generation and Sentence-BERT semantic similarity to compare user-submitted photos with assigned recovery activities."],
  ["Geolocation & risk prediction", "Prepared geographical data, engineered features and experimented with Random Forest and XGBoost to classify locations as safe, moderate risk or high risk. Used distance calculations to identify potentially risky locations within 500 meters and worked on prediction APIs for location-based notifications."],
  ["Recovery tracking", "Designed sobriety counters, relapse logging, recovery streaks, milestones, emotional well-being tracking and daily check-ins."],
  ["Gamification", "Designed daily activities, personalized challenges, points, achievements and motivational feedback, supported by AI-assisted task verification."],
  ["Community support", "Developed Django backend functionality for community posts, user profiles, following and group interactions."],
  ["Recovery follow-up", "Designed backend models for mood and craving check-ins, recovery statistics, doctor-assigned activities, and weekly and monthly progress reports."],
];
const stack = [
  ["Mobile", "Flutter, Dart"],
  ["Backend", "Python, Django, Django REST Framework, RESTful APIs"],
  ["AI & deep learning", "YOLOv8, FLAN-T5 (google/flan-t5-xl), Sentence-BERT (paraphrase-multilingual-MiniLM-L12-v2), Hugging Face Transformers, PyTorch"],
  ["Machine learning & data", "Scikit-learn, Random Forest, XGBoost, Pandas, NumPy, categorical encoding, feature engineering, RobustScaler"],
  ["Cloud & location", "Firebase Authentication, Cloud Firestore, Firebase Cloud Messaging, GPS, geodesic distance calculations"],
  ["Development tools", "Visual Studio Code, Google Colab, Postman, Git / GitHub"],
];

export default function LightwayProjectDetails({ language }: { language: Language }) {
  const t = (text: string) => translate(text, language);
  const list = (items: string[][]) => <ul>{items.map(([title, description]) => <li key={title}><strong>{t(title)}:</strong> {t(description)}</li>)}</ul>;
  return <div className="work-contribution">
    <h4>{t("PFE internship project")}</h4>
    <p>{t("Developed during my final-year internship (Projet de Fin d’Études), Lightway brings together full-stack mobile development, computer vision, NLP and machine learning in an addiction recovery application.")}</p>
    <h4>{t("Project Overview")}</h4>
    <p>{t("Lightway is an AI-powered mobile application designed to support people recovering from drug and alcohol addiction. Built with Flutter, Django, Python and Firebase, it combines personalized recovery tracking, photo-based activity verification, geographical risk prediction and community support.")}</p>
    <h4>{t("Features & contributions")}</h4>
    {list(features)}
    <h4>{t("My technical role")}</h4>
    <p>{t("Developed Django REST Framework backend functionality and community APIs, worked on Flutter–Django–Firebase integration, integrated AI models for photo-based task verification, and designed recovery-tracking database models. Prepared geographical datasets, trained and evaluated risk classifiers, and worked on REST API integration for predictions and GPS safety alerts.")}</p>
    <h4>{t("Technologies & Tools")}</h4>
    {list(stack)}
    <h4>{t("Project objective")}</h4>
    <p>{t("Demonstrate how AI and mobile development can support healthier habits, consistent recovery activities and awareness of potentially risky environments through a personalized digital companion.")}</p>
  </div>;
}
