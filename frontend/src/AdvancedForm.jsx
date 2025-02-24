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
            <option value="">Select your system</option>
            <option value="inefficient_boiler">Inefficient Boiler</option>
            <option value="efficient_boiler">Efficient Boiler</option>
            <option value="electric_heating">Electric Heating</option>
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
        </div>
        <div className="form-group">
          <label>Home Size</label>
          <select
            name="home_size"
            value={inputs.home_size}
            onChange={handleChange}
          >
            <option value="">Select home size</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
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
