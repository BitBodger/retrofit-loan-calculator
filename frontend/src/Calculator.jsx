import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import TabHeader from './TabHeader';
import BasicForm from './BasicForm';
import AdvancedForm from './AdvancedForm';
import ResultsSummary from './ResultsSummary';
import measureDefaults from './measureDefaults';

function Calculator() {
  // -------------------------------
  // State Declarations
  // -------------------------------
  // Basic inputs shared between forms
  const [inputs, setInputs] = useState({
    installation_cost: '',
    installation_lifetime: '25',
    energy_savings_per_year: '',
    loan_interest_rate: '6',
    loan_term: '5',
    discount_rate: '3',
    energy_price_escalation: '5',
    down_payment: '',
    government_subsidy: '',
    home_size: 'medium',               // "small", "medium", or "large"
    existing_heating_system: 'old_gas_boiler'
  });

  // Flag for whether discounting should be applied
  const [applyDiscount, setApplyDiscount] = useState(true);

  // Calculation result returned from backend
  const [results, setResults] = useState(null);

  // Active tab control ("basic" or "advanced")
  const [activeTab, setActiveTab] = useState("basic");

  // Measures added in advanced mode (each with its own fields)
  const [measures, setMeasures] = useState([]);

  // Loading indicator for when we’re waiting for the backend calculation
  //const [isLoading, setIsLoading] = useState(false);

  // -------------------------------
  // Handler Functions
  // -------------------------------
  
  // Toggle discounting checkbox
  const handleApplyDiscountChange = (e) => {
    setApplyDiscount(e.target.checked);
  };

  // Generic handler for basic inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  // Get a multiplier based on the selected home size.
  // "small" => 0.67 (33% less), "medium" => 1.0, "large" => 1.5 (50% more)
  const getHomeSizeMultiplier = (homeSize) => {
    if (homeSize.toLowerCase() === "small") return 0.67;
    if (homeSize.toLowerCase() === "large") return 1.5;
    return 1.0;
  };

  // Add a new (empty) measure to the advanced measures array.
  const addNewMeasure = () => {
    setMeasures(prev => [
      ...prev,
      { name: '', installation_cost: '', annual_savings: '', lifetime: '' }
    ]);
  };

  // Handler to update a specific measure field.
  // When the measure "name" is selected, we look up defaults from measureDefaults,
  // adjust by the home size multiplier, and (if applicable) override the annual savings 
  // based on the selected existing heating system.
  const handleMeasureChange = (index, e) => {
    const { name, value } = e.target;
    setMeasures(prevMeasures => {
      const newMeasures = [...prevMeasures];
      if (name === "name") {
        // Get the home size multiplier from the current home size selection.
        const multiplier = getHomeSizeMultiplier(inputs.home_size);
        // Look up the defaults for the selected measure from measureDefaults.
        const defaults = measureDefaults[value.toLowerCase()] || {};
        // Start with the generic default annual savings.
        let defaultAnnualSavings = defaults.annual_savings;
        // If there is a mapping for existing heating systems, use that value.
        if (defaults.existingSystems && inputs.existing_heating_system) {
          const existingKey = inputs.existing_heating_system.toLowerCase();
          if (defaults.existingSystems[existingKey] !== undefined) {
            defaultAnnualSavings = defaults.existingSystems[existingKey];
          }
        }
        // Update this measure with the default values (adjusted by multiplier).
        newMeasures[index] = { 
          ...newMeasures[index],
          name: value,
          installation_cost: defaults.installation_cost 
            ? (parseFloat(defaults.installation_cost) * multiplier).toFixed(2) 
            : '',
          annual_savings: defaultAnnualSavings 
            ? (parseFloat(defaultAnnualSavings) * multiplier).toFixed(2) 
            : '',
          lifetime: defaults.lifetime 
            ? defaults.lifetime.toString() 
            : newMeasures[index].lifetime,
        };
      } else {
        // For other fields (installation_cost, annual_savings, lifetime), update normally.
        newMeasures[index] = { 
          ...newMeasures[index],
          [name]: value,
        };
      }
      return newMeasures;
    });
  };

  // -------------------------------
  // useEffect Hooks for Derived Calculations
  // -------------------------------

  // When the existing heating system changes, update each measure's default savings.
  useEffect(() => {
    const existingSystemKey = inputs.existing_heating_system.toLowerCase();
    setMeasures(prevMeasures =>
      prevMeasures.map(m => {
        const measureDef = measureDefaults[m.name?.toLowerCase()];
        if (!measureDef) return m;
  
        let defaultAnnualSavings = measureDef.annual_savings;
        if (measureDef.existingSystems && measureDef.existingSystems[existingSystemKey] !== undefined) {
          defaultAnnualSavings = measureDef.existingSystems[existingSystemKey];
        }
  
        return {
          ...m,
          annual_savings: defaultAnnualSavings.toFixed(2),
        };
      })
    );
  }, [inputs.existing_heating_system]);

  // When the advanced tab is active, derive the basic inputs (installation cost, energy savings,
  // and lifetime) from the measures.
  useEffect(() => {
    if (measures.length > 0 && activeTab === "advanced") {
      const derivedInstallationCost = measures.reduce(
        (sum, measure) => sum + parseFloat(measure.installation_cost || 0),
        0
      );
      const derivedEnergySavings = measures.reduce(
        (sum, measure) => sum + parseFloat(measure.annual_savings || 0),
        0
      );
      const derivedInstallationLifetime = measures.reduce(
        (max, measure) => Math.max(max, parseInt(measure.lifetime || 0, 10)),
        0
      );
  
      setInputs(prev => ({
        ...prev,
        installation_cost: derivedInstallationCost.toFixed(2),
        energy_savings_per_year: derivedEnergySavings.toFixed(2),
        installation_lifetime: derivedInstallationLifetime.toString(),
      }));
    }
  }, [activeTab, measures]);

  // When the home size changes, update each measure's default values by applying the multiplier.
  useEffect(() => {
    const multiplier = getHomeSizeMultiplier(inputs.home_size);
    const existingSystemKey = inputs.existing_heating_system.toLowerCase();
    
    setMeasures(prevMeasures =>
      prevMeasures.map(measure => {
        if (measure.name && measureDefaults[measure.name.toLowerCase()]) {
          const defaults = measureDefaults[measure.name.toLowerCase()];
          // Look up the annual savings for the selected existing heating system, if available.
          let defaultAnnualSavings = defaults.annual_savings;
          if (defaults.existingSystems && defaults.existingSystems[existingSystemKey] !== undefined) {
            defaultAnnualSavings = defaults.existingSystems[existingSystemKey];
          }
          return {
            ...measure,
            installation_cost: defaults.installation_cost 
              ? (parseFloat(defaults.installation_cost) * multiplier).toFixed(2) 
              : measure.installation_cost,
            annual_savings: defaultAnnualSavings 
              ? (parseFloat(defaultAnnualSavings) * multiplier).toFixed(2) 
              : measure.annual_savings,
            // Lifetime remains unchanged by home size
          };
        }
        return measure;
      })
    );
  }, [inputs.home_size, inputs.existing_heating_system]);
  

  // -------------------------------
  // Derived Calculation for Loan Amount
  // -------------------------------
  const calculatedLoanAmount = (
    parseFloat(inputs.installation_cost || 0) -
    parseFloat(inputs.down_payment || 0) -
    parseFloat(inputs.government_subsidy || 0)
  );

  // -------------------------------
  // recalc: Main Calculation Function
  // -------------------------------
  const recalc = useCallback(() => {
    //setIsLoading(true);

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
      use_advanced_form: activeTab === "advanced",
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
      .catch(error => console.error('Error making API call:', error))
      //.finally(() => {
      //  setIsLoading(false);
      //});
  }, [inputs, activeTab, measures]);

  // -------------------------------
  // Form Submission Handler
  // -------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    recalc();
  };

  // -------------------------------
  // Render Component
  // -------------------------------
  return (
    <div className="calculator">
      {/* Render Tab Header */}
      <TabHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Render AdvancedForm if active */}
      {activeTab === "advanced" && (
        <AdvancedForm
          inputs={inputs}
          handleChange={handleChange}
          measures={measures}
          handleMeasureChange={handleMeasureChange}
          addNewMeasure={addNewMeasure}
        />
      )}

      {/* Render BasicForm (always shown) */}
      <BasicForm
        inputs={inputs}
        handleChange={handleChange}
        calculatedLoanAmount={calculatedLoanAmount}
        handleSubmit={handleSubmit}
        applyDiscount={applyDiscount}
        handleApplyDiscountChange={handleApplyDiscountChange}
        advancedActive={activeTab === "advanced"}
      />

      {/* Show calculation results if available */}
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
