import { useState, useEffect, useRef } from "react";
import reviews from "./reviews.json"; // Import reviews JSON

// Helper function to shuffle an array using the Fisher-Yates algorithm.
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function Header() {
  // State to hold the shuffled reviews.
  const [shuffledReviews, setShuffledReviews] = useState([]);
  // Ref for the review container so we can control its scroll position.
  const reviewRef = useRef(null);

  // On component mount, shuffle the reviews and store them.
  useEffect(() => {
    if (reviews.length > 0) {
      setShuffledReviews(shuffleArray(reviews));
    }
  }, []);

  // Auto-scroll effect: continuously scroll the reviews container.
  useEffect(() => {
    const container = reviewRef.current;
    if (!container) return;

    let scrollStep = 1; // pixels to scroll each step
    const delay = 50;   // delay in ms between steps
    const intervalId = setInterval(() => {
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (container.scrollTop >= maxScroll) {
        container.scrollTop = 0;
      } else {
        container.scrollTop += scrollStep;
      }
    }, delay);

    // Cleanup interval on component unmount.
    return () => clearInterval(intervalId);
  }, [shuffledReviews]);

  // If reviews haven't loaded yet, show a loading message.
  if (shuffledReviews.length === 0) return <p>Loading reviews...</p>;

  return (
    <div className="header-container">
      <div className="header-title-tagline-container">
        <div className="header-logo-calculator-container">
          <div className="ascii-art">
            <p style={{ fontFamily: "monospace", whiteSpace: "pre" }}>
              ______________________{"\n"}
              |  _________________  |{"\n"}
              | | RETROFIT =  $$$ | |{"\n"}
              | |_________________| |{"\n"}
              |  ___ ___ ___   ___  |{"\n"}
              | | 7 | 8 | 9 | | + | |{"\n"}
              | |___|___|___| |___| |{"\n"}
              | | 4 | 5 | 6 | | - | |{"\n"}
              | |___|___|___| |___| |{"\n"}
              | | 1 | 2 | 3 | | x | |{"\n"}
              | |___|___|___| |___| |{"\n"}
              | | . | 0 | = | | / | |{"\n"}
              | |___|___|___| |___| |{"\n"}
              |_____________________|
            </p>
          </div>
          <div className="title">
            <h1>
              Retrofit<br />Savings<br />Calculator
            </h1>
          </div>
        </div>
        <div className="tagline">
          <h3>Where energy savings and loan repayments collide</h3>
        </div>
      </div>
      
      {/* Review Wrapper */}
      <div className="review-wrapper">
        <h4 className="reviews-heading">⍟TrustCaptain Reviews⍟</h4>
        <div className="review-scroll-wrapper">
          <div className="review-container" ref={reviewRef}>
            {shuffledReviews.map((review, idx) => (
              <div key={idx} className="review-item">
                {review.review.map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
                <p className="review-author">— {review.name}</p>
                <hr className="review-separator" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
