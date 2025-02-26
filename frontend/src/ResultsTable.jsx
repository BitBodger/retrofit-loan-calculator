import PropTypes from "prop-types";

function ResultsTable({ results }) {
  return (
    <table border="1">
      <thead>
        <tr>
          <th>Year</th>
          <th>Annual Payment</th>
          <th>Remaining Loan Balance</th>
          <th>Interest Portion</th>
          <th>Principal Portion</th>
          <th>Annual Energy Savings</th>
          <th>Discount Factor</th>
          <th>Discounted Net Cash Flow</th>
          <th>Cumulative Cash Flow</th>
          <th>Cumulative Discounted Cash Flow</th>
        </tr>
      </thead>
      <tbody>
        {results.yearly_details.map((detail, rowIndex) => (
          <tr key={rowIndex}>
            {Object.entries(detail).map((value, colIndex) => (
              <td key={colIndex}>
                {typeof value === "number"
                  ? `£${value.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`
                  : value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

ResultsTable.propTypes = {
  results: PropTypes.shape({
    yearly_details: PropTypes.arrayOf(
      PropTypes.shape({
        year: PropTypes.number.isRequired,
        annual_loan_payment: PropTypes.number.isRequired,
        remaining_loan_balance: PropTypes.number.isRequired,
        interest_portion: PropTypes.number.isRequired,
        principal_portion: PropTypes.number.isRequired,
        annual_energy_savings: PropTypes.number.isRequired,
        discount_factor: PropTypes.number.isRequired,
        discounted_net_cash_flow: PropTypes.number.isRequired,
        cumulative_cash_flow: PropTypes.number.isRequired,
        cumulative_discounted_cash_flow: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default ResultsTable;
