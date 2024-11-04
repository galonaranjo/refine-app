import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import VideoUpload from "./components/VideoUpload.jsx";

function App() {
  return (
    <>
      <div className="card">
        <VideoUpload />
      </div>
    </>
  );
}

export default App;
