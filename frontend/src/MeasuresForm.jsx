import PropTypes from 'prop-types';
import CurrencyInput from 'react-currency-input-field';
import { NumericFormat } from 'react-number-format';
import { createForceTwoDecimalsOnBlur } from './numberFormatUtils';

function MeasuresForm({ measures, handleMeasureChange, addNewMeasure, handleRemoveMeasure }) {
  return (
    <div className="measures-form">
      {measures.map((measure, index) => (
        <div key={index} className="measure">
          <label>Measure {index + 1}</label>
          {/* Remove button (a cross icon) */}
          <button 
            type="button" 
            className="remove-measure" 
            onClick={() => handleRemoveMeasure(index)}
            title="Remove measure"
          >
            &#x2715;
          </button>
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
            <option value="battery">Battery</option>
            <option value="double_glazing">Double Glazing</option>
            <option value="triple_glazing">Triple Glazing</option>
            <option value="heating_controls">Heating Controls</option>
            <option value="high_efficiency_boiler">High-Efficiency Boiler</option>
          </select>

          <label className="small-label">Installation cost</label>
          <CurrencyInput
            id={`installation_cost_${index}`}
            name="installation_cost"
            placeholder="Installation Cost"
            // Only format if the value is a number; otherwise, leave as is.
            value={
              typeof measure.installation_cost === 'number'
                ? measure.installation_cost.toFixed(2)
                : measure.installation_cost
            }
            decimalsLimit={2} 
            prefix="£"
            onValueChange={(value) =>
              handleMeasureChange(index, { target: { name: 'installation_cost', value } })
            }
            onBlur={createForceTwoDecimalsOnBlur(handleMeasureChange, 'installation_cost', index)}
          />

          <label className="small-label">Repairs and Enabling Works</label>
          <CurrencyInput
            id={`ancillary_cost_${index}`}
            name="ancillary_cost"
            placeholder="Cost of additional works"
            // Only format if the value is a number; otherwise, leave as is.
            value={measure.ancillary_cost}
            decimalsLimit={2} 
            prefix="£"
            onValueChange={(value) =>
              handleMeasureChange(index, { target: { name: 'ancillary_cost', value } })
            }
            onBlur={createForceTwoDecimalsOnBlur(handleMeasureChange, 'ancillary_cost', index)}
          />

          <label className="small-label">Annual savings</label>
          <CurrencyInput
            id={`annual_savings_${index}`}
            name="annual_savings"
            placeholder="Expected Annual Savings"
            value={
              typeof measure.annual_savings === 'number'
                ? measure.annual_savings.toFixed(2)
                : measure.annual_savings
            }
            decimalsLimit={2}
            prefix="£"
            onValueChange={(value) =>
              handleMeasureChange(index, { target: { name: 'annual_savings', value } })
            }
            onBlur={createForceTwoDecimalsOnBlur(handleMeasureChange, 'annual_savings', index)}
          />

          <label className="small-label">Measure lifetime</label>  
          <NumericFormat
            value={measure.lifetime}
            displayType={'input'}
            placeholder="How long will the measure last?"
            suffix={' years'}
            decimalScale={0}
            onValueChange={(values) => {
              const { value } = values;
              handleMeasureChange(index, { target: { name: 'lifetime', value } });
            }}
          />
        </div>
      ))}
      <button type="button" className="add-measure" onClick={addNewMeasure}>
        Add Measure
      </button>
    </div>
  );
}

MeasuresForm.propTypes = {
  measures: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      installation_cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      annual_savings: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      lifetime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  handleMeasureChange: PropTypes.func.isRequired,
  handleRemoveMeasure: PropTypes.func.isRequired,
  addNewMeasure: PropTypes.func.isRequired,
};

export default MeasuresForm;
