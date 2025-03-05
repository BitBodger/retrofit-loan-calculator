import PropTypes from 'prop-types';
import EnergyPriceChart from './EnergyPriceChart';

function EnergyForm({
  selectedScenario,
  customScenarioData,
  onDataPointChange,
  onScenarioChange
}) {
  return (
    <div className="form-container">
      <div className="form-section">
        <h3>Scenarios</h3>
        <div className="form-group">
          <label>
            <input
              type="radio"
              name="options"
              value="low"
              checked={selectedScenario === 'low'}
              onChange={onScenarioChange}
            />
            Low Price Scenario
          </label>
          <p className="field-description">
            Assumes swift renewable adoption and effective policies that keep energy price increases modest.
          </p>
        </div>
        <div className="form-group">
          <label>
            <input
              type="radio"
              name="options"
              value="middle"
              checked={selectedScenario === 'middle'}
              onChange={onScenarioChange}
            />
            Middle Price Scenario
          </label>
          <p className="field-description">
            Assumes moderate renewable uptake and balanced policy measures resulting in steady energy price growth.
          </p>
        </div>
        <div className="form-group">
          <label>
            <input
              type="radio"
              name="options"
              value="high"
              checked={selectedScenario === 'high'}
              onChange={onScenarioChange}
            />
            High Price Scenario
          </label>
          <p className="field-description">
            Assumes slower progress on renewables and continued global market volatility leading to higher price rises.
          </p>
        </div>
        {/* Reset Button */}
        <div className="form-group">
          <button type="button" onClick={() => onDataPointChange('reset')}>
            Reset Scenario
          </button>
        </div>
      </div>

      <div className="form-section chart-section">
        <h3>Chart</h3>
        <EnergyPriceChart
          scenarioData={customScenarioData}
          onDataPointChange={onDataPointChange}
        />
      </div>
    </div>
  );
}

EnergyForm.propTypes = {
  selectedScenario: PropTypes.string.isRequired,
  customScenarioData: PropTypes.array.isRequired,
  onDataPointChange: PropTypes.func.isRequired,
  onScenarioChange: PropTypes.func.isRequired,
};

export default EnergyForm;
