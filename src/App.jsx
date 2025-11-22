import { useState } from "react";
import axios from "axios";
import "./App.css";
import logoImage from "./assets/MBG.png"; 
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  const [image, setImage] = useState(null);
  const [bgRemoved, setBgRemoved] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  const API_KEY = import.meta.env.VITE_API_KEY;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setBgRemoved(null);
    }
  };

  const handleRemoveBackground = async () => {
    if (!image) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("image_file", image);
    formData.append("size", "auto");

    try {
      const response = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        formData,
        {
          headers: { "X-Api-Key": API_KEY },
          responseType: "blob",
        }
      );
      const url = URL.createObjectURL(response.data);
      setBgRemoved(url);
    } catch (error) {
      console.error(error);
      alert("Failed. Check API Key or Internet.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!bgRemoved) return;
    const link = document.createElement("a");
    link.href = bgRemoved;
    link.download = "background-removed.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-wrapper">
       <SpeedInsights />
      <div className="modal-card">
        <div className="left-panel">
          <div className="dot-pattern"></div>
          <div className="promo-content">
            <div className="brand-badge">
               <span>Background Remover</span>
            </div>
            <h2 className="promo-text">Remove Background<br/>from Your Image</h2>
            <p className="promo-sub">Upload an image and remove the background automatically.</p>
            <div className="hero-image-container">
                <img src={logoImage} alt="Hero" className="hero-img" />
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="panel-header">
            <h2>Background Remover</h2>
            <span className="badge">Daily Credits: 50</span>
          </div>
          
          <p className="instruction-text">
            Remove backgrounds from your images with AI-powered creativity.
          </p>

          <div className="upload-area">
            {bgRemoved ? (
               <div className="result-view">
                 <div className="checkered-bg">
                    <img src={bgRemoved} alt="Result" />
                 </div>
                 <div className="actions">
                    <button onClick={handleDownload} className="action-btn download">Download HD ⬇️</button>
                    <button onClick={() => {setImage(null); setBgRemoved(null)}} className="action-btn reset">Start Over 🔄</button>
                 </div>
               </div>
            ) : (
              <>
                <input 
                  type="file" 
                  id="file-upload" 
                  className="file-input-hidden"
                  onChange={handleImageChange} 
                />
                <label htmlFor="file-upload" className="upload-label">
                  <div className="upload-icon">🖼️</div>
                  <span className="upload-title">
                    {image ? `Selected: ${image.name}` : "Click to browse or drop file"}
                  </span>
                  <span className="upload-subtitle">Supported: JPEG, PNG, WebP</span>
                </label>
              </>
            )}
          </div>

          {!bgRemoved && (
            <button 
              onClick={handleRemoveBackground} 
              disabled={isLoading || !image}
              className="process-btn"
            >
              {isLoading ? "✨ Processing..." : "✨ Remove Background"}
            </button>
          )}
          
        </div>

      </div>
    </div>
  );
}

export default App;
