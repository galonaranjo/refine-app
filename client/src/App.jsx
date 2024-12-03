import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoUpload from "./components/VideoUpload";
import FeedbackPage from "./components/FeedbackPage";
import LoginPage from "./components/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<VideoUpload />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
    </Router>
  );
}

export default App;
