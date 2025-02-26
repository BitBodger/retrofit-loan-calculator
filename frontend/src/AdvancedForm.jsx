import PropTypes from 'prop-types';
import MeasuresForm from './MeasuresForm';

function AdvancedForm({ inputs, handleChange, measures, handleMeasureChange, addNewMeasure }) {
  return (
    <div className="advanced-form-container">
      <div className="your-home-section">
        <h3>Your Home</h3>
        <div className="form-group">
          <label>Existing Heating System</label>
          <select
            name="existing_heating_system"
            value={inputs.existing_heating_system}
            onChange={handleChange}
          >
            <option value="old_gas_boiler">Old Gas Boiler</option>
            <option value="new_gas_boiler">New Gas Boiler</option>
            <option value="old_oil_boiler">Old Oil Boiler</option>
            <option value="new_oil_boiler">New Oil Boiler</option>
            <option value="old_lpg_boiler">Old LPG Boiler</option>
            <option value="new_lpg_boiler">New LPG Boiler</option>
            <option value="old_electric_storage_heaters">Old Electric Storage Heaters</option>
            <option value="new_electric_storage_heaters">New Electric Storage Heaters</option>
            <option value="coal">Coal</option>
          </select>
          <p className="field-description">
            The energy savings of certain retrofit measures depend on what heating system you have or are going to replace 
          </p>
        </div>
        <div className="form-group">
          <label>Home Size</label>
          <select
            name="home_size"
            value={inputs.home_size}
            onChange={handleChange}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
          <p className="field-description">
            {
              inputs.home_size === "medium"
                ? "Medium-sized 2-3 bedroom house"
                : inputs.home_size === "small"
                  ? "Smaller 1-2 bedroom house or flat"
                  : "Larger 4-5 bedroom house"
            }
          </p>
        </div>
      </div>
      <div className="measures-section">
        <h3>Measures</h3>
        <MeasuresForm 
          measures={measures} 
          handleMeasureChange={handleMeasureChange} 
          addNewMeasure={addNewMeasure}
        />
      </div>
    </div>
  );
}

AdvancedForm.propTypes = {
  inputs: PropTypes.shape({
    installation_cost: PropTypes.string,
    installation_lifetime: PropTypes.string,
    energy_savings_per_year: PropTypes.string,
    loan_interest_rate: PropTypes.string,
    loan_term: PropTypes.string,
    discount_rate: PropTypes.string,
    energy_price_escalation: PropTypes.string,
    down_payment: PropTypes.string,
    government_subsidy: PropTypes.string,
    home_size: PropTypes.string,
    existing_heating_system: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  measures: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      installation_cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      annual_savings: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      lifetime: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ).isRequired,
  handleMeasureChange: PropTypes.func.isRequired,
  addNewMeasure: PropTypes.func.isRequired,
};

export default AdvancedForm;
