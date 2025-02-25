import PropTypes from 'prop-types';
import CurrencyInput from 'react-currency-input-field';

function MeasuresForm({ measures, handleMeasureChange, addNewMeasure }) {
  return (
    <div className="measures-form">
      {measures.map((measure, index) => (
        <div key={index} className="measure">
          <label>Measure {index + 1}</label>
          <select
            name="name"
            value={measure.name}
            onChange={(e) => handleMeasureChange(index, e)}
          >
            <option value="">Select a measure</option>
            <option value="loft_insulation_top_up">Loft Insulation (top-up)</option>
            <option value="cavity_wall_insulation">Cavity Wall Insulation</option>
            <option value="solid_wall_insulation">Solid Wall Insulation</option>
            <option value="draught_proofing">Draught Proofing</option>
            <option value="heat_pump">Heat Pump</option>
            <option value="solar_pv">Solar PV</option>
            <option value="double_glazing">Double Glazing</option>
            <option value="triple_glazing">Triple Glazing</option>
            <option value="heating_controls">Heating Controls</option>
            <option value="high_efficiency_boiler">High-Efficiency Boiler</option>
          </select>

          <CurrencyInput
            id={`installation_cost_${index}`}
            name="installation_cost"
            placeholder="Installation Cost (£)"
            value={measure.installation_cost}
            decimalsLimit={2}
            prefix="£"
            onValueChange={(value) =>
              handleMeasureChange(index, { target: { name: 'installation_cost', value } })
            }
          />
          <CurrencyInput
            id={`annual_savings_${index}`}
            name="annual_savings"
            placeholder="Annual Savings (£)"
            value={measure.annual_savings}
            decimalsLimit={2}
            prefix="£"
            onValueChange={(value) =>
              handleMeasureChange(index, { target: { name: 'annual_savings', value } })
            }
          />
          <input
            type="number"
            name="lifetime"
            placeholder="Measure Lifetime (Years)"
            value={measure.lifetime}
            onChange={(e) => handleMeasureChange(index, e)}
          />
        </div>
      ))}
      <button type="button" onClick={addNewMeasure}>Add Measure</button>
    </div>
  );
}

MeasuresForm.propTypes = {
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

export default MeasuresForm;
