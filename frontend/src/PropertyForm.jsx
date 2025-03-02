import PropTypes from 'prop-types';

function PropertyForm({ inputs, handleChange }) {
  return (
    <div className="form-container">
      <div className="form-section">
   
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

        <div className="form-group">
          <label>Heating System</label>
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
            <option value="heat_pump">Heat Pump</option>
            <option value="coal">Coal</option>
          </select>
          <p className="field-description">
            The energy savings of certain retrofit measures depend on what heating system you have or are going to replace 
          </p>
        </div>
        
      </div>

      <div className="form-section">
        <div className="form-group">
          <label>Glazing</label>
          <select
            name="existing_glazing"
            value={inputs.existing_glazing}
            onChange={handleChange}
          >
            <option value="single_glazing">Single Glazing</option>
            <option value="double_glazing">Double Glazing</option>
            <option value="triple_glazing">Triple Glazing</option>
            <option value="secondary_glazing">Secondary Glazing</option>
          </select>
          <p className="field-description">
            What type of glazing is currently installed in your home? 
          </p>
        </div>
        
        <div className="form-group">
          <label>Doors</label>
          <select
            name="existing_doors"
            value={inputs.existing_doors}
            onChange={handleChange}
          >
            <option value="uninsulated">Uninsulated</option>
            <option value="insulated">Insulated</option>
          </select>
          <p className="field-description">
            What kind of the doors does the property currently have
          </p>
        </div>
      </div>

      <div className="form-section">

        <div className="form-group">
          <label>Existing Wall Insulation</label>
          <select
            name="existing_wall-insulation"
            value={inputs.existing_wall_insulation}
            onChange={handleChange}
          >
            <option value="uninsulated">Uninsulated</option>
            <option value="filled_cavity">Filled Cavity Wall</option>
          </select>
          <p className="field-description">
            What kind of insulation do you currently have in your walls? 
          </p>
        </div>
        
        <div className="form-group">
          <label>Existing Loft Insulation</label>
          <select
            name="existing_loft_insulation"
            value={inputs.existing_loft_insulation}
            onChange={handleChange}
          >
            <option value="uninsulated">Uninsulated</option>
            <option value="mm100">100mm</option>
            <option value="mm270">270mm</option>
          </select>
          <p className="field-description">
            {
              inputs.existing_loft_insulation === "100mm"
                ? "This could do with topping up to 270mm"
                : inputs.existing_loft_insulation === "none"
                  ? "Loft insulation is one of the cheapest and most effective ways of reducing your bills. Insulate your loft!"
                  : "270mm is an optimal thickness of loft insulation - no need to top-up"
            }
          </p>
        </div>

        <div className="form-group">
          <label>Existing Floor Insulation</label>
          <select
            name="existing_floor_insulation"
            value={inputs.existing_floor_insulation}
            onChange={handleChange}
          >
            <option value="unisulated">Uninsulated</option>
            <option value="insulated">Insulated</option>
          </select>
          <p className="field-description">

          </p>
        </div>

      </div>

    </div>
  );
}

PropertyForm.propTypes = {
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
    existing_glazing: PropTypes.string,
    existing_doors: PropTypes.string,
    existing_wall_insulation: PropTypes.string,
    existing_loft_insulation: PropTypes.string,
    existing_floor_insulation: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default PropertyForm;
