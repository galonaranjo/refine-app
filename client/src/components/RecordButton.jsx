import { MicrophoneIcon } from "@heroicons/react/24/solid";
import { useVideoRecorder } from "../hooks/useVideoRecorder";

function RecordButton({ videoRef }) {
  const { isRecording, error, startRecording, stopRecording } = useVideoRecorder(videoRef);

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        className={`
          p-4 rounded-full 
          ${isRecording ? "bg-red-600 animate-pulse" : "bg-red-500"} 
          hover:bg-red-600 transition-all
          shadow-lg hover:shadow-xl
          transform hover:scale-105
        `}
      >
        <MicrophoneIcon className="h-6 w-6 text-white" />
      </button>
    </div>
  );
}

export default RecordButton;
