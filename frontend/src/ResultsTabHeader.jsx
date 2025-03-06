import PropTypes from 'prop-types';

function ResultsTabHeader({ activeResultsTab, setActiveResultsTab }) {
  return (
    <div> 
      <div className="results-tabs">
        <button 
          data-dot="summary"
          onClick={() => setActiveResultsTab("summary")} 
          className={activeResultsTab === "summary" ? "active" : ""}
        >
          Summary
        </button>
        <button 
          data-dot="forecast"
          onClick={() => setActiveResultsTab("forecast")} 
          className={activeResultsTab === "forecast" ? "active" : ""}
        >
          Savings Forecast
        </button>
        <hr />
      </div>
    </div> 
  );
}

ResultsTabHeader.propTypes = {
  activeResultsTab: PropTypes.string,
  setActiveResultsTab: PropTypes.func,
}

export default ResultsTabHeader;
