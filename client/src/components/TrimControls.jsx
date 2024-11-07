import { useState, useCallback } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

function TrimControls({ duration, onTrimRangeChange, loading }) {
  const [trimRange, setTrimRange] = useState([0, duration]);

  const handleRangeChange = useCallback(
    (range) => {
      setTrimRange(range);
      onTrimRangeChange(range);
    },
    [onTrimRangeChange]
  );

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <Slider range min={0} max={duration} value={trimRange} onChange={handleRangeChange} className="my-4" />

      {/* Time indicators */}
      <div className="flex justify-between text-sm text-white mt-2">
        <span>{trimRange[0].toFixed(2)}s</span>
        <span>{trimRange[1].toFixed(2)}s</span>
      </div>
    </div>
  );
}

export default TrimControls;
