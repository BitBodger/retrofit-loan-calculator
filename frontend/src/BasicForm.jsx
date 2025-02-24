import PropTypes from 'prop-types';

function BasicForm({ inputs, handleChange, calculatedLoanAmount, handleSubmit, applyDiscount }) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="basic-form-container">
        {/* Installation Section */}
        <div className="form-section">
          <h3>Installation</h3>
          <div className="form-group">
            <label>Installation Cost (£):</label>
            <input
              type="number"
              name="installation_cost"
              value={inputs.installation_cost}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Installation Lifetime (Years):</label>
            <input
              type="number"
              name="installation_lifetime"
              value={inputs.installation_lifetime}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Energy Savings Per Year (£):</label>
            <input
              type="number"
              name="energy_savings_per_year"
              value={inputs.energy_savings_per_year}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Loan Section */}
        <div className="form-section">
          <h3>Loan</h3>
          <div className="form-group">
            <label>Loan Interest Rate (%):</label>
            <input
              type="number"
              step="0.1"
              name="loan_interest_rate"
              value={inputs.loan_interest_rate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Loan Term (Years):</label>
            <input
              type="number"
              name="loan_term"
              value={inputs.loan_term}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Loan Amount (£):</label>
            <input
              type="text"
              name="loan_amount"
              value={calculatedLoanAmount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
              readOnly
            />
          </div>
        </div>

        {/* Economic Conditions Section */}
        <div className="form-section">
          <h3>Economic Conditions</h3>
          <div className="form-group">
            <label>Discount Rate (%):</label>
            <input
              type="number"
              step="0.1"
              name="discount_rate"
              value={inputs.discount_rate}
              onChange={handleChange}
              disabled={!applyDiscount}
            />
          </div>
          <div className="form-group">
            <label>Energy Price Escalation (%):</label>
            <input
              type="number"
              step="0.1"
              name="energy_price_escalation"
              value={inputs.energy_price_escalation}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Upfront Costs Section */}
        <div className="form-section">
          <h3>Upfront Costs</h3>
          <div className="form-group">
            <label>Down Payment (£):</label>
            <input
              type="number"
              step="0.01"
              name="down_payment"
              value={inputs.down_payment}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Government Subsidy (£):</label>
            <input
              type="number"
              step="0.01"
              name="government_subsidy"
              value={inputs.government_subsidy}
              onChange={handleChange}
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
