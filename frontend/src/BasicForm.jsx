import PropTypes from 'prop-types';
import CurrencyInput from 'react-currency-input-field';
import { NumericFormat } from 'react-number-format';

function BasicForm({ 
  inputs, 
  handleChange, 
  calculatedLoanAmount, 
  handleSubmit, 
  applyDiscount
}) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="basic-form-container">
        {/* Installation Section */}
        <div className="form-section">
          <h3>Installation</h3>
          <div className="form-group">
            <label>Installation Cost</label>
            <CurrencyInput
              id="installation_cost"
              name="installation_cost"
              placeholder="£0.00"
              value={inputs.installation_cost}
              decimalsLimit={2}
              prefix="£"
              onValueChange={(value) =>
                handleChange({ target: { name: 'installation_cost', value } })
              }
            />
          </div>
          <div className="form-group">
            <label>Installation Lifetime</label>
            <NumericFormat
              value={inputs.installation_lifetime}
              displayType={'input'}
              suffix={' years'}
              placeholder='0 years'
              decimalScale={0}
              onValueChange={(values) => {
                const { value } = values;
                handleChange({ target: { name: 'installation_lifetime', value } });
              }}
            />
          </div>
          <div className="form-group">
            <label>Energy Savings Per Year</label>
            <CurrencyInput
              id="energy_savings_per_year"
              name="energy_savings_per_year"
              placeholder="£0.00"
              value={inputs.energy_savings_per_year}
              decimalsLimit={2}
              prefix="£"
              onValueChange={(value) =>
                handleChange({ target: { name: 'energy_savings_per_year', value } })
              }
            />
          </div>
        </div>

        {/* Loan Section */}
        <div className="form-section">
          <h3>Loan</h3>
          <div className="form-group">
            <label>Loan Interest Rate</label>
            <NumericFormat
              value={inputs.loan_interest_rate}
              displayType={'input'}
              suffix={'%'}
              decimalScale={1}
              fixedDecimalScale={true}
              onValueChange={(values) => {
                const { value } = values;
                handleChange({ target: { name: 'loan_interest_rate', value } });
              }}
            />
          </div>
          <div className="form-group">
            <label>Loan Term</label>
            <NumericFormat
              value={inputs.loan_term}
              displayType={'input'}
              suffix={' years'}
              decimalScale={0}
              onValueChange={(values) => {
                const { value } = values;
                handleChange({ target: { name: 'loan_term', value } });
              }}
            />
          </div>
          <div className="form-group">
            <label>Loan Amount</label>
            <CurrencyInput
              id="loan_amount"
              name="loan_amount"
              value={calculatedLoanAmount.toFixed(2)}
              decimalsLimit={2}
              prefix="£"
              readOnly
            />
          </div>
        </div>

        {/* Economic Conditions Section */}
        <div className="form-section">
          <h3>Economic Conditions</h3>
          <div className="form-group">
            <label>Discount Rate</label>
            <NumericFormat
              value={inputs.discount_rate}
              displayType={'input'}
              suffix={'%'}
              decimalScale={1}
              fixedDecimalScale={true}
              onValueChange={(values) => {
                const { value } = values;
                handleChange({ target: { name: 'discount_rate', value } });
              }}
              disabled={!applyDiscount}
            />
          </div>
          <div className="form-group">
            <label>Energy Price Escalation</label>
            <NumericFormat
              value={inputs.energy_price_escalation}
              displayType={'input'}
              suffix={'%'}
              decimalScale={1}
              fixedDecimalScale={true}
              onValueChange={(values) => {
                const { value } = values;
                handleChange({ target: { name: 'energy_price_escalation', value } });
              }}
            />
          </div>
        </div>

        {/* Upfront Costs Section */}
        <div className="form-section">
          <h3>Upfront Costs</h3>
          <div className="form-group">
            <label>Down Payment</label>
            <CurrencyInput
              id="down_payment"
              name="down_payment"
              placeholder="£0.00"
              value={inputs.down_payment}
              decimalsLimit={2}
              prefix="£"
              onValueChange={(value) =>
                handleChange({ target: { name: 'down_payment', value } })
              }
            />
          </div>
          <div className="form-group">
            <label>Government Subsidy</label>
            <CurrencyInput
              id="government_subsidy"
              name="government_subsidy"
              placeholder="£0.00"
              value={inputs.government_subsidy}
              decimalsLimit={2}
              prefix="£"
              onValueChange={(value) =>
                handleChange({ target: { name: 'government_subsidy', value } })
              }
            />
          </div>
        </div>
      </div>
      <div className="form-controls">
        <button type="submit">Calculate</button>
      </div>
    </form>
  );
}

BasicForm.propTypes = {
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
  calculatedLoanAmount: PropTypes.number.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  applyDiscount: PropTypes.bool.isRequired,
  handleApplyDiscountChange: PropTypes.func.isRequired,
};

export default BasicForm;
