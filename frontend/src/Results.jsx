import PropTypes from 'prop-types'
import { formatCurrency } from './numberFormatUtils';

function Results({ results, applyDiscount, handleApplyDiscountChange }) {
  return (
    <div className="results-container">
      <div className="summary-container">
        <h2>Summary</h2>
        <div className="summary-totals">
          {applyDiscount ? (
            <>
              <p>
                <strong>Total Cost</strong>
                {results.total_cost
                  ? formatCurrency(results.discounted_total_cost)
                  : 'N/A'}
              </p>
              <p>
                <strong>Total Interest</strong>
                {results.total_interest
                  ? formatCurrency(results.total_interest)
                  : 'N/A'}
              </p>
              <p>
                <strong>Total Savings</strong>
                {results.total_savings
                  ? formatCurrency(results.discounted_total_savings)
                  : 'N/A'}
              </p>
              <p>
                <strong>Net Savings</strong>
                {results.net_savings
                  ? formatCurrency(results.discounted_net_savings)
                  : 'N/A'}
              </p>
              <p>
                <strong>Payback Year</strong>
                {results.discounted_payback_time === 0 ? (
                  <span className="no-payback">
                    Does not payback within<br />installation lifetime
                  </span>
                ) : (
                  results.discounted_payback_time
                )}
              </p>
              <p>
                <strong>Most Out of Pocket</strong>
                {results.discounted_most_negative_cumulative_cashflow ? (
                  <>
                    {formatCurrency(results.discounted_most_negative_cumulative_cashflow)}
                    <br />
                    {" in year " + results.discounted_most_negative_cumulative_cashflow_year}
                  </>
                ) : 'N/A'}
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Total Cost</strong>
                {results.total_cost
                  ? formatCurrency(results.total_cost)
                  : 'N/A'}
              </p>
              <p>
                <strong>Total Interest</strong>
                {results.total_interest
                  ? formatCurrency(results.total_interest)
                  : 'N/A'}
              </p>
              <p>
                <strong>Total Savings</strong>
                {results.total_savings
                  ? formatCurrency(results.total_savings)
                  : 'N/A'}
              </p>
              <p>
                <strong>Net Savings</strong>
                {results.net_savings
                  ? formatCurrency(results.net_savings)
                  : 'N/A'}
              </p>
              <p>
                <strong>Payback Year</strong>
                {results.payback_time === 0 ? (
                  <span className="no-payback">
                    Does not payback within installation lifetime
                  </span>
                ) : (
                  results.payback_time
                )}
              </p>
              <p>
                <strong>Most Out of Pocket</strong>
                {results.most_negative_cumulative_cashflow ? (
                  <>
                    {formatCurrency(results.most_negative_cumulative_cashflow)}
                    <br />
                    {" in year " + results.most_negative_cumulative_cashflow_year}
                  </>
                ) : 'N/A'}
              </p>
            </>
          )}
        </div>
      </div>
      {results.yearly_details && (
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
};


export default Results;
