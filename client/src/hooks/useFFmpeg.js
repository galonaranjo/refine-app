import { useState, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

export function useFFmpeg() {
  const [ffmpeg] = useState(() => new FFmpeg());
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load FFmpeg
  const load = useCallback(async () => {
    if (loaded) return;

    try {
      setLoading(true);
      // Use absolute paths from the root
      await ffmpeg.load({
        coreURL: await toBlobURL("/ffmpeg-core.js", "text/javascript"),
        wasmURL: await toBlobURL("/ffmpeg-core.wasm", "application/wasm"),
      });
      setLoaded(true);
    } catch (error) {
      console.error("Error loading FFmpeg:", error);
      // More detailed error information
      console.error("Attempted to load from:", "/ffmpeg-core.js");
      if (error instanceof TypeError) {
        console.error("Network error - check if files exist in public directory");
      }
    } finally {
      setLoading(false);
    }
  }, [loaded, ffmpeg]);

  // Trim video function
  const trimVideo = useCallback(
    async (inputFile, startTime, endTime) => {
      if (!loaded) {
        await load();
      }

      try {
        setLoading(true);

        // Write input file to FFmpeg virtual filesystem
        await ffmpeg.writeFile("input.mp4", await fetchFile(inputFile));

        // Run FFmpeg command to trim video
        await ffmpeg.exec([
          "-i",
          "input.mp4",
          "-ss",
          `${startTime}`,
          "-to",
          `${endTime}`,
          "-c",
          "copy", // Use fast copy operation instead of re-encoding
          "output.mp4",
        ]);

        // Read the output file
        const data = await ffmpeg.readFile("output.mp4");

        // Create a blob from the output data
        const blob = new Blob([data], { type: "video/mp4" });

        // Clean up files from virtual filesystem
        await ffmpeg.deleteFile("input.mp4");
        await ffmpeg.deleteFile("output.mp4");

        return blob;
      } catch (error) {
        console.error("Error trimming video:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [load, loaded, ffmpeg]
  );

  return {
    ffmpeg,
    loading,
    loaded,
    load,
    trimVideo,
  };
}
