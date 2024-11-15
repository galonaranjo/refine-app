import { MicrophoneIcon } from "@heroicons/react/24/solid";
import { useVideoRecorder } from "../hooks/useVideoRecorder";

function RecordButton({ videoRef }) {
  const { isRecording, error, startRecording, stopRecording, audioLevel } =
    useVideoRecorder(videoRef);

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const scale = isRecording ? 1 + audioLevel * 0.8 + Math.sin(Date.now() / 200) * 0.1 : 1;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        className={`
          p-4 rounded-full 
          ${isRecording ? "bg-red-600" : "bg-red-500"} 
          hover:bg-red-600 transition-all
          shadow-lg hover:shadow-xl
          relative
        `}
        style={{
          transform: `scale(${scale})`,
          transition: "transform 0.05s ease-out",
          boxShadow: isRecording
            ? `0 0 ${10 + audioLevel * 20}px ${2 + audioLevel * 10}px rgba(239, 68, 68, 0.5)`
            : "",
        }}
      >
        <MicrophoneIcon className="h-6 w-6 text-white" />
      </button>
    </div>
  );
}

export default RecordButton;
