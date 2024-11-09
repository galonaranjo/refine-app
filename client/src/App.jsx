import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoUpload from "./components/VideoUpload";
import CoachingFeedback from "./components/CoachingFeedback";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VideoUpload />} />
        <Route path="/feedback/:id" element={<CoachingFeedback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
