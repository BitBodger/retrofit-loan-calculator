import PropTypes from 'prop-types'
import { formatCurrency } from './numberFormatUtils';
import ResultsTabHeader from './ResultsTabHeader.jsx';

function Results({ 
  results, 
  applyDiscount, 
  handleApplyDiscountChange, 
  activeResultsTab, 
  setActiveResultsTab 
}) {

  return (
    <div className="results-container">
      <ResultsTabHeader 
        activeResultsTab={activeResultsTab}
        setActiveResultsTab={setActiveResultsTab}      
      />
      {activeResultsTab === "summary" && (
      <div className="summary-container">
        <h2>Summary</h2>

        <div className="summary-grid">
          {/* Totals Card */}
          <div className="summary-card">
            <div className="summary-card-content">
              <p><strong>Total Cost:</strong> {formatCurrency(applyDiscount ? results.discounted_total_cost : results.total_cost) || 'N/A'}</p>
              <p><strong>Total Interest:</strong> {formatCurrency(results.total_interest) || 'N/A'}</p>
              <p><strong>Total Savings:</strong> {formatCurrency(applyDiscount ? results.discounted_total_savings : results.total_savings) || 'N/A'}</p>
            </div>

            <div className="summary-card-description">
              <h2>Costs & Savings</h2>
            </div>    
          </div>

          {/* Net Savings Card */}
          <div className="summary-card">
            <div className={`summary-card-content ${results.net_savings < 0 ? 'negative' : 'positive'}`}>
              <p className={`net-savings-value ${results.net_savings < 0 ? 'negative' : 'positive'}`}>
                {formatCurrency(applyDiscount ? results.discounted_net_savings : results.net_savings) || 'N/A'}
              </p>
            </div>

            <div className={`summary-card-description ${results.net_savings < 0 ? 'negative' : 'positive'}`}>
              <h2>Net Savings</h2>
            </div>
          </div>

          {/* Payback & Out of Pocket Card */}
          <div className="summary-card">
            
            <div className="summary-card-content"> 
              <div className="outcomes-grid">
                <div>
                  <strong>Payback Year:</strong> 
                  {applyDiscount
                    ? results.discounted_payback_time === 0
                      ? <div className="warning-badge">Does not pay back within installation lifetime</div>
                      : results.discounted_payback_time
                    : results.payback_time === 0
                      ? <div className="warning-badge">Does not pay back within installation lifetime</div>
                      : results.payback_time}
                </div>
                <div>
                  <strong>Most Out of Pocket:</strong>
                  {applyDiscount
                    ? results.discounted_most_negative_cumulative_cashflow
                      ? <>
                          {formatCurrency(results.discounted_most_negative_cumulative_cashflow)}
                          <br />in year {results.discounted_most_negative_cumulative_cashflow_year}
                        </>
                      : 'N/A'
                    : results.most_negative_cumulative_cashflow
                      ? <>
                          {formatCurrency(results.most_negative_cumulative_cashflow)}
                          <br />in year {results.most_negative_cumulative_cashflow_year}
                        </>
                      : 'N/A'}
                </div>
              </div>  
            </div>

            <div className="summary-card-description">
              <h2>Outcomes</h2>
            </div> 

          </div>
        </div>
      </div>
      )}

      {activeResultsTab === "forecast" && results.yearly_details && (
        <div className="results-table-wrapper">
          <div className="results-header">
            <h1>Savings Forecast</h1>
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                name="apply_discount"
                checked={applyDiscount}
                onChange={handleApplyDiscountChange}
              />
              <label>
                Apply Discounting:{' '}
                <span className="DiscountExplainer">
                  Discounting converts future cash flows into their present-day value, accounting for the time value of money.
                </span>
              </label>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Annual Loan Repayment</th>
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
              {results.yearly_details.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.year}</td>
                  <td>
                    {formatCurrency(detail.annual_loan_payment)}
                  </td>
                  <td>
                    {Math.abs(detail.remaining_loan_balance) < 0.01
                      ? '£0.00'
                      : formatCurrency(detail.remaining_loan_balance)}
                  </td>
                  <td>
                    {formatCurrency(detail.interest_portion)}
                  </td>
                  <td>
                    {formatCurrency(detail.principal_portion)}
                  </td>
                  <td>
                    {formatCurrency(detail.annual_energy_savings)}
                  </td>
                  {applyDiscount ? (
                    <>
                      <td>
                        {formatCurrency(detail.discounted_net_cash_flow)}
                      </td>
                      <td>
                        {formatCurrency(detail.discounted_cumulative_net_cash_flow)}
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        {formatCurrency(detail.net_cash_flow)}
                      </td>
                      <td>
                        {formatCurrency(detail.cumulative_net_cash_flow)}
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
  );
}

Results.propTypes = {
  results: PropTypes.shape({
    total_cost: PropTypes.number,
    total_interest: PropTypes.number,
    total_savings: PropTypes.number,
    net_savings: PropTypes.number,
    payback_time: PropTypes.number,
    most_negative_cumulative_cashflow: PropTypes.number,
    most_negative_cumulative_cashflow_year: PropTypes.number,
    discounted_total_cost: PropTypes.number,
    discounted_total_savings: PropTypes.number,
    discounted_net_savings: PropTypes.number,
    discounted_payback_time: PropTypes.number,
    discounted_most_negative_cumulative_cashflow: PropTypes.number,
    discounted_most_negative_cumulative_cashflow_year: PropTypes.number,
    yearly_details: PropTypes.arrayOf(PropTypes.shape({
      year: PropTypes.number,
      annual_loan_payment: PropTypes.number,
      remaining_loan_balance: PropTypes.number,
      interest_portion: PropTypes.number,
      principal_portion: PropTypes.number,
      annual_energy_savings: PropTypes.number,
      discount_factor: PropTypes.number,
      net_cash_flow: PropTypes.number,
      discounted_net_cash_flow: PropTypes.number,
      cumulative_net_cash_flow: PropTypes.number,
      discounted_cumulative_net_cash_flow: PropTypes.number,
    }))
  }).isRequired,
  applyDiscount: PropTypes.bool.isRequired,
  handleApplyDiscountChange: PropTypes.func.isRequired,
  activeResultsTab: PropTypes.string,
  setActiveResultsTab: PropTypes.func,
};


export default Results;
