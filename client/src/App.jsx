import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoUpload from "./components/VideoUpload";
import FeedbackPage from "./components/FeedbackPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VideoUpload />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
    </Router>
  );
}

export default App;
