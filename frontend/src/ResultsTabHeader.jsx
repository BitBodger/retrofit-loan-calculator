import PropTypes from 'prop-types';

function ResultsTabHeader({
  activeResultsTab,
  setActiveResultsTab,
  applyDiscount,
  handleApplyDiscountChange,
}) {
  return (
    <div className="results-tab-bar">
      <div className="tab-buttons">
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
      </div>
      <div className="checkbox-wrapper">
        <label>
          <input
            type="checkbox"
            name="apply_discount"
            checked={applyDiscount}
            onChange={handleApplyDiscountChange}
          />
          Apply Discounting
          <span
            className="tooltip-icon"
            title="Discounting converts future cash flows into their present-day value, accounting for the time value of money."
          >
            🛈
          </span>
        </label>
      </div>
    </div>
  );
}

ResultsTabHeader.propTypes = {
  activeResultsTab: PropTypes.string,
  setActiveResultsTab: PropTypes.func,
  applyDiscount: PropTypes.bool.isRequired,
  handleApplyDiscountChange: PropTypes.func.isRequired,
};

export default ResultsTabHeader;
