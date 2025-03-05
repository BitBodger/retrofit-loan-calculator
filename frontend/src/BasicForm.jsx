import PropTypes from 'prop-types';
import CurrencyInput from 'react-currency-input-field';
import { NumericFormat } from 'react-number-format';
import { createForceTwoDecimalsOnBlur } from './numberFormatUtils';
import LoadingDots from './LoadingSpinner';

function BasicForm({ 
  inputs, 
  handleChange, 
  calculatedLoanAmount, 
  handleSubmit, 
  applyDiscount,
  advancedActive,
  errorMessage,
  loading
}) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-container">

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
              onBlur={(e) => createForceTwoDecimalsOnBlur(handleChange, e.target.name)(e)}
              readOnly={advancedActive}
            />
            <p className="field-description">
              Total cost of all the retrofit measures
            </p>
          </div>
          
          <div className="form-group">
            <label>Installation Lifetime</label>
            <NumericFormat
              value={inputs.installation_lifetime}
              displayType={'input'}
              suffix={' years'}
              placeholder="0 years"
              decimalScale={0}
              onValueChange={(values) =>
                handleChange({ target: { name: 'installation_lifetime', value: values.value } })
              }
              readOnly={advancedActive}
            />
            <p className="field-description">
              How long the installation will last
            </p>
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
              onBlur={(e) => createForceTwoDecimalsOnBlur(handleChange, e.target.name)(e)}
              readOnly={advancedActive}
            />
            <p className="field-description">
              Total predicted energy savings from the installation in the first year
            </p>
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
              onValueChange={(values) =>
                handleChange({ target: { name: 'loan_interest_rate', value: values.value } })
              }
            />
            <p className="field-description">
              The interest rate of the loan you&apos;re considering taking out
            </p>
          </div>
          
          <div className="form-group">
            <label>Loan Term</label>
            <NumericFormat
              value={inputs.loan_term}
              displayType={'input'}
              suffix={' years'}
              decimalScale={0}
              onValueChange={(values) =>
                handleChange({ target: { name: 'loan_term', value: values.value } })
              }
            />
            <p className="field-description">
              The period in which the loan will be repaid
            </p>
          </div>
          
          <div className="form-group">
            <label>Loan Amount</label>
            <CurrencyInput
              id="loan_amount"
              name="loan_amount"
              value={parseFloat(calculatedLoanAmount).toFixed(2)}
              decimalsLimit={2}
              fixedDecimalLength={true}
              prefix="£"
              readOnly
            />
            <p className="field-description">
              The total you are borrowing - this is the installation cost less any down payment or government subsidy
            </p>
          </div>
        </div>

        {/* Upfront Costs Section */}
        <div className="form-section">
          <h3>Upfront Payments</h3>
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
              onBlur={(e) => createForceTwoDecimalsOnBlur(handleChange, e.target.name)(e)}
            />
            <p className="field-description">
              Any sum that you are paying upfront out of your own pocket
            </p>
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
              onBlur={(e) => createForceTwoDecimalsOnBlur(handleChange, e.target.name)(e)}
            />
            <p className="field-description">
              Any sum funded by government that is being paid upfront 
            </p>
          </div>
        </div>

        {/* Economic Conditions Section */}
        <div className="form-section">
          <h3>Economic Conditions</h3>
          {!advancedActive && (
          <div className="form-group">
            <label>Energy Price Escalation</label>
            <NumericFormat
              value={inputs.basic_energy_price_escalation}
              displayType={'input'}
              suffix={'%'}
              decimalScale={1}
              fixedDecimalScale={true}
              onValueChange={(values) =>
                handleChange({ target: { name: 'energy_price_escalation', value: values.value } })
              }
            />
            <p className="field-description">
              The rate at which energy prices are expected to increase year on year for the duration of the installation
            </p>
          </div>)}
          
          <div className="form-group">
            <label>Discount Rate</label>
            <NumericFormat
              value={inputs.discount_rate}
              displayType={'input'}
              suffix={'%'}
              decimalScale={1}
              fixedDecimalScale={true}
              onValueChange={(values) =>
                handleChange({ target: { name: 'discount_rate', value: values.value } })
              }
              disabled={!applyDiscount}
            />
            <p className="field-description">
              The rate at which money devalues over time considering inflation, savings interest and/or borrowing costs
            </p>
          </div>
        </div>

      </div>
      <div className="form-controls">
        <button type="submit">Calculate</button>
        {/* Display error message if present */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {loading && (<LoadingDots />)}
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
    basic_energy_price_escalation: PropTypes.string,
    down_payment: PropTypes.string,
    government_subsidy: PropTypes.string,
    home_size: PropTypes.string,
    existing_heating_system: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  calculatedLoanAmount: PropTypes.number.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  applyDiscount: PropTypes.bool.isRequired,
  advancedActive: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  loading: PropTypes.bool,
};

export default BasicForm;
