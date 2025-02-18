import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function Calculator() {
  const [inputs, setInputs] = useState({
    installation_cost: '5000',
    installation_lifetime: '20',
    energy_savings_per_year: '600',
    loan_interest_rate: '6.1',
    loan_term: '5',
    discount_rate: '3',
    energy_price_escalation: '5',
    down_payment: '1000',
    government_subsidy: ''
  });
  
  // State to choose whether to apply discounting (live control)
  const [applyDiscount, setApplyDiscount] = useState(true);
  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyDiscountChange = (e) => {
    setApplyDiscount(e.target.checked);
  };

  // Function to call the API for recalculation
  const recalc = useCallback(() => {
    const payload = {
      installation_cost: parseFloat(inputs.installation_cost),
      installation_lifetime: parseInt(inputs.installation_lifetime, 10),
      energy_savings_per_year: parseFloat(inputs.energy_savings_per_year),
      loan_interest_rate: parseFloat(inputs.loan_interest_rate) / 100,
      loan_term: parseInt(inputs.loan_term, 10),
      discount_rate: applyDiscount ? parseFloat(inputs.discount_rate) / 100 : 0,
      energy_price_escalation: parseFloat(inputs.energy_price_escalation) / 100,
      down_payment: parseFloat(inputs.down_payment) || 0,
      government_subsidy: parseFloat(inputs.government_subsidy) || 0
    };

    axios
      .post('./api/calculate', payload)
      .then(response => setResults(response.data))
      .catch(error => console.error('Error making API call:', error));
  }, [inputs, applyDiscount]); // recalc depends on these values

  useEffect(() => {
    if (results !== null) {
      recalc();
    }
  }, [applyDiscount, recalc, results]);

  // Calculate the loan amount from the inputs
  const calculatedLoanAmount = (
    parseFloat(inputs.installation_cost || 0) -
    parseFloat(inputs.down_payment || 0) -
    parseFloat(inputs.government_subsidy || 0)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    recalc();
  };

  return (
    <div className="page-wrapper">
      <div className="calculator">
        <form onSubmit={handleSubmit}>
          <div className="form-container">
            {/* Section 1: Installation */}
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

            {/* Section 2: Loan */}
            <div className="form-section">
              <h3>Loan</h3>
              <div className="form-group">
                <label>Loan Interest Rate %:</label>
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

            {/* Section 3: Economic Conditions */}
            <div className="form-section">
              <h3>Economic Conditions</h3>
              <div className="form-group">
                <label>Discount Rate %:</label>
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
                <label>Energy Price Escalation %:</label>
                <input
                  type="number"
                  step="0.1"
                  name="energy_price_escalation"
                  value={inputs.energy_price_escalation}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Section 4: Upfront Costs */}
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
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                name="apply_discount"
                checked={applyDiscount}
                onChange={handleApplyDiscountChange}
              />
              <label>Apply Discounting</label>
              <p className="DiscountExplainer">Discounting is the process of converting future cash flows into their present-day value, accounting for the time value of money.</p>
            </div>
          </div>
        </form>

        {results && (
          <div className="results-container">
            <h2>Summary</h2>
            <div>
              <strong>
                {applyDiscount ? (
                  <>
                    <p>
                      Total Cost: £
                      {results.total_cost
                        ? results.discounted_total_cost.toLocaleString('en-GB', { minimumFractionDigits: 2 })
                        : 'N/A'}
                    </p>
                    <p>
                      Total Savings: £
                      {results.total_savings
                        ? results.discounted_total_savings.toLocaleString('en-GB', { minimumFractionDigits: 2 })
                        : 'N/A'}
                    </p>
                    <p>
                      Net Savings: £
                      {results.net_savings
                        ? results.discounted_net_savings.toLocaleString('en-GB', { minimumFractionDigits: 2 })
                        : 'N/A'}
                    </p>
                  </>) : (<>
                    <p>
                      Total Cost: £
                      {results.total_cost
                        ? results.total_cost.toLocaleString('en-GB', { minimumFractionDigits: 2 })
                        : 'N/A'}
                    </p>
                    <p>
                      Total Savings: £
                      {results.total_savings
                        ? results.total_savings.toLocaleString('en-GB', { minimumFractionDigits: 2 })
                        : 'N/A'}
                    </p>
                    <p>
                      Net Savings: £
                      {results.net_savings
                        ? results.net_savings.toLocaleString('en-GB', { minimumFractionDigits: 2 })
                        : 'N/A'}
                    </p>
                  </>)}
              </strong>
            </div>
            {results.yearly_details && (
              <div>
                <h2>Results</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Annual Loan Payment</th>
                      <th>Remaining Loan Balance</th>
                      <th>Interest Portion</th>
                      <th>Principal Portion</th>
                      <th>Annual Energy Savings</th>
                      {applyDiscount ? (
                        <>
                          <th>Discounted Net Cash Flow</th>
                          <th>Discounted Cumulative Cash Flow</th>
                        </>
                      ) : (
                        <>
                          <th>Net Cash Flow</th>
                          <th>Cumulative Net Cash Flow</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {results.yearly_details.map((detail, rowIndex) => (
                      <tr key={rowIndex}>
                        <td>{detail.year}</td>
                        <td>
                          £
                          {detail.annual_loan_payment.toLocaleString('en-GB', {
                            minimumFractionDigits: 2
                          })}
                        </td>
                        <td>
                          £
                          {Math.abs(detail.remaining_loan_balance) < 0.01
                            ? '0.00'
                            : detail.remaining_loan_balance.toLocaleString('en-GB', {
                                minimumFractionDigits: 2
                              })}
                        </td>
                        <td>
                          £
                          {detail.interest_portion.toLocaleString('en-GB', {
                            minimumFractionDigits: 2
                          })}
                        </td>
                        <td>
                          £
                          {detail.principal_portion.toLocaleString('en-GB', {
                            minimumFractionDigits: 2
                          })}
                        </td>
                        <td>
                          £
                          {detail.annual_energy_savings.toLocaleString('en-GB', {
                            minimumFractionDigits: 2
                          })}
                        </td>
                        {applyDiscount ? (
                          <>
                            <td>
                              £
                              {detail.discounted_net_cash_flow.toLocaleString('en-GB', {
                                minimumFractionDigits: 2
                              })}
                            </td>
                            <td>
                              £
                              {detail.discounted_cumulative_net_cash_flow.toLocaleString('en-GB', {
                                minimumFractionDigits: 2
                              })}
                            </td>
                          </>
                        ) : (
                          <>
                            <td>
                              £
                              {detail.net_cash_flow.toLocaleString('en-GB', {
                                minimumFractionDigits: 2
                              })}
                            </td>
                            <td>
                              £
                              {detail.cumulative_net_cash_flow.toLocaleString('en-GB', {
                                minimumFractionDigits: 2
                              })}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Calculator;
