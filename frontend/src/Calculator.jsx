import { useState, useCallback } from 'react';
import axios from 'axios';
import TabHeader from './TabHeader';
import BasicForm from './BasicForm';
import AdvancedForm from './AdvancedForm';
import ResultsSummary from './ResultsSummary';
import measureDefaults from './measureDefaults';

function Calculator() {
  // Main input state for both basic and advanced fields.
  const [inputs, setInputs] = useState({
    installation_cost: '',
    installation_lifetime: '',
    energy_savings_per_year: '',
    loan_interest_rate: '6',
    loan_term: '5',
    discount_rate: '3',
    energy_price_escalation: '5',
    down_payment: '',
    government_subsidy: '',
    home_size: '',
    existing_heating_system: ''
  });

  // State to control whether discounting is applied.
  const [applyDiscount, setApplyDiscount] = useState(true);

  // Calculation results from the backend.
  const [results, setResults] = useState(null);

  // Controls which advanced/basic tab is active.
  const [activeTab, setActiveTab] = useState("basic");

  // State to manage dynamic measures in the advanced section.
  const [measures, setMeasures] = useState([]);

  // Handler to toggle discounting.
  const handleApplyDiscountChange = (e) => {
    setApplyDiscount(e.target.checked);
  };

  // Handler for changes in basic input fields.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleMeasureChange = (index, e) => {
    const { name, value } = e.target;
    setMeasures(prevMeasures => {
      const newMeasures = [...prevMeasures];
      if (name === "name") {
        // Merge in default values based on the selected measure.
        const defaults = measureDefaults[value] || {};
        newMeasures[index] = { 
          ...newMeasures[index],
          name: value,
          ...defaults,
        };
      } else {
        newMeasures[index] = { 
          ...newMeasures[index],
          [name]: value,
        };
      }
      return newMeasures;
    });
  };

  // Adds a new measure object to the measures array.
  const addNewMeasure = () => {
    setMeasures(prev => [
      ...prev,
      { name: '', installation_cost: '', annual_savings: '', lifetime: '' }
    ]);
  };

  // Calculate the loan amount from basic inputs.
  const calculatedLoanAmount = (
    parseFloat(inputs.installation_cost || 0) -
    parseFloat(inputs.down_payment || 0) -
    parseFloat(inputs.government_subsidy || 0)
  );

  // Recalculate the results based on both basic and advanced fields.
  const recalc = useCallback(() => {
    const payload = {
      installation_cost: parseFloat(inputs.installation_cost),
      installation_lifetime: parseInt(inputs.installation_lifetime, 10),
      energy_savings_per_year: parseFloat(inputs.energy_savings_per_year),
      loan_interest_rate: parseFloat(inputs.loan_interest_rate) / 100,
      loan_term: parseInt(inputs.loan_term, 10),
      discount_rate: parseFloat(inputs.discount_rate) / 100,
      energy_price_escalation: parseFloat(inputs.energy_price_escalation) / 100,
      down_payment: parseFloat(inputs.down_payment) || 0,
      government_subsidy: parseFloat(inputs.government_subsidy) || 0,
      home_size: inputs.home_size,
      existing_heating_system: inputs.existing_heating_system,
      measures: measures.map(measure => ({
        name: measure.name,
        installation_cost: parseFloat(measure.installation_cost),
        repairs_and_enabling_works_cost: parseFloat(measure.repairs_and_enabling_works_cost || 0),
        annual_savings: parseFloat(measure.annual_savings),
        lifetime: parseInt(measure.lifetime, 10)
      }))
    };

    axios
      .post('./api/calculate', payload)
      .then(response => setResults(response.data))
      .catch(error => console.error('Error making API call:', error));
  }, [inputs, measures]);

  // Handle form submission from the BasicForm.
  const handleSubmit = (e) => {
    e.preventDefault();
    recalc();
  };

  return (
    <div className="calculator">
      {/* Render the tab header */}
      <TabHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Always show BasicForm.
          If advanced tab is active, render AdvancedForm above BasicForm */}
      {activeTab === "advanced" && (
        <AdvancedForm
          inputs={inputs}
          handleChange={handleChange}
          measures={measures}
          handleMeasureChange={handleMeasureChange}
          addNewMeasure={addNewMeasure}
        />
      )}

      <BasicForm
        inputs={inputs}
        handleChange={handleChange}
        calculatedLoanAmount={calculatedLoanAmount}
        handleSubmit={handleSubmit}
        applyDiscount={applyDiscount}
        handleApplyDiscountChange={handleApplyDiscountChange}
      />

      {results && (
        <ResultsSummary
          results={results}
          applyDiscount={applyDiscount}
          handleApplyDiscountChange={handleApplyDiscountChange}
        />
      )}
    </div>
  );
}

export default Calculator;
