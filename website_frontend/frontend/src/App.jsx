import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image first!");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("https://potato-desies-api.onrender.com/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-cover bg-center"
      style={{
        backgroundImage:
        
          "url('https://plus.unsplash.com/premium_photo-1664910307279-7f8e551e1e1d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmljZSUyMGZpZWxkfGVufDB8fDB8fHww')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 flex flex-col items-center w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-6 text-center">
          Potato Leaf Disease Detection
        </h1>

        <form
          onSubmit={handleUpload}
          className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-4"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 border rounded-lg cursor-pointer focus:outline-none p-2"
          />

          {preview && (
            <div className="mt-4 flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg shadow-md border"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-md w-full max-w-md text-center">
            {result.error ? (
              <p className="text-red-600 font-medium">Error: {result.error}</p>
            ) : (
              <>
                <p className="text-lg font-semibold text-green-700">
                  Class: {result.predicted_class}
                </p>
                <p className="text-gray-700">
                  Confidence: {result.confidence}
                </p>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 text-white text-sm font-medium drop-shadow">
          Made by Arghya
        </footer>
      </div>
    </div>
  );
}

export default App;
