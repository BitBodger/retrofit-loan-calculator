import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import TabHeader from './TabHeader';
import BasicForm from './BasicForm';
import PropertyForm from './PropertyForm';
import Results from './Results';
import measureDefaults from './measureDefaults';
import MeasuresForm from './MeasuresForm';
import EnergyForm from './EnergyForm';
import { scenarios as defaultScenarios } from './scenarios';

function Calculator() {
  // Scenario-related state
  const [selectedScenario, setSelectedScenario] = useState('middle');
  
  // Custom scenarios state for editable values, initialized as clones of the defaults
  const [customScenarios, setCustomScenarios] = useState(() => {
    const initialCustoms = {};
    Object.keys(defaultScenarios).forEach(scenario => {
      initialCustoms[`${scenario}_custom`] = [...defaultScenarios[scenario]];
    });
    return initialCustoms;
  });

  // Other state declarations
  const [inputs, setInputs] = useState({
    installation_cost: '',
    installation_lifetime: '25',
    energy_savings_per_year: '',
    loan_interest_rate: '6',
    loan_term: '5',
    basic_energy_price_escalation: '3',
    discount_rate: '3',
    down_payment: '',
    government_subsidy: '',
    home_size: 'medium',
    existing_heating_system: 'old_gas_boiler',
    existing_glazing: '',
    existing_doors: '',
    existing_wall_insulation: '',
    existing_loft_insulation: '100mm',
    existing_floor_insulation: '',
  });

  const [applyDiscount, setApplyDiscount] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [activeAdvancedTab, setActiveAdvancedTab] = useState("property");
  const [measures, setMeasures] = useState([
    { name: '', installation_cost: '', ancillary_cost: '', annual_savings: '', lifetime: '' }
  ]);
  const [errorMessage, setErrorMessage] = useState('');

  // Handler functions
  const handleApplyDiscountChange = (e) => {
    setApplyDiscount(e.target.checked);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const getHomeSizeMultiplier = (homeSize) => {
    if (homeSize.toLowerCase() === "small") return 0.67;
    if (homeSize.toLowerCase() === "large") return 1.5;
    return 1.0;
  };

  const addNewMeasure = () => {
    setMeasures(prev => [
      ...prev,
      { name: '', installation_cost: '', ancillary_cost: '', annual_savings: '', lifetime: '' }
    ]);
  };

  const handleMeasureChange = (index, e) => {
    const { name, value } = e.target;
    setMeasures(prevMeasures => {
      const newMeasures = [...prevMeasures];
      if (name === "name") {
        const multiplier = getHomeSizeMultiplier(inputs.home_size);
        const defaults = measureDefaults[value.toLowerCase()] || {};
        let defaultAnnualSavings = defaults.annual_savings;

        if (defaults.existingHeatingSystem && inputs.existing_heating_system) {
          const existingKey = inputs.existing_heating_system.toLowerCase();
          if (defaults.existingHeatingSystem[existingKey] !== undefined) {
            defaultAnnualSavings = defaults.existingHeatingSystem[existingKey];
          }
        }
        if (defaults.existingGlazing && inputs.existing_glazing) {
          const existingKey = inputs.existing_glazing.toLowerCase();
          if (defaults.existingGlazing[existingKey] !== undefined) {
            defaultAnnualSavings = defaults.existingGlazing[existingKey];
          }
        }
        if (defaults.existingLoftInsulation && inputs.existing_loft_insulation) {
          const existingKey = inputs.existing_loft_insulation.toLowerCase();
          if (defaults.existingLoftInsulation[existingKey] !== undefined) {
            defaultAnnualSavings = defaults.existingLoftInsulation[existingKey];
          }
        }
        
        newMeasures[index] = { 
          ...newMeasures[index],
          name: value,
          installation_cost: defaults.installation_cost 
            ? parseFloat(defaults.installation_cost) * multiplier 
            : '',
          annual_savings: defaultAnnualSavings 
            ? parseFloat(defaultAnnualSavings) * multiplier 
            : '',
          lifetime: defaults.lifetime 
            ? defaults.lifetime.toString() 
            : newMeasures[index].lifetime,
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

  const handleRemoveMeasure = (indexToRemove) => {
    setMeasures(prevMeasures => prevMeasures.filter((_, idx) => idx !== indexToRemove));
  };

  // Derived calculations for advanced mode
  useEffect(() => {
    if (measures.length > 0 && activeTab === "advanced") {
      const derivedInstallationCost = measures.reduce(
        (sum, measure) => sum + parseFloat(measure.installation_cost || 0)
          + parseFloat(measure.ancillary_cost || 0),
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

  useEffect(() => {
    const existingHeatingSystemKey = inputs.existing_heating_system.toLowerCase();
    const existingGlazingKey = inputs.existing_glazing.toLowerCase();
    const existingLoftInsulationKey = inputs.existing_loft_insulation.toLowerCase();
    setMeasures(prevMeasures =>
      prevMeasures.map(m => {
        const measureDef = measureDefaults[m.name?.toLowerCase()];
        if (!measureDef) return m;
  
        let defaultAnnualSavings = measureDef.annual_savings;
        if (measureDef.existingHeatingSystem && measureDef.existingHeatingSystem[existingHeatingSystemKey] !== undefined) {
          defaultAnnualSavings = measureDef.existingHeatingSystem[existingHeatingSystemKey];
        }
        if (measureDef.existingGlazing && measureDef.existingGlazing[existingGlazingKey] !== undefined) {
          defaultAnnualSavings = measureDef.existingGlazing[existingGlazingKey];
        }
        if (measureDef.existingLoftInsulation && measureDef.existingLoftInsulation[existingLoftInsulationKey] !== undefined) {
          defaultAnnualSavings = measureDef.existingLoftInsulation[existingLoftInsulationKey];
        }
        return {
          ...m,
          annual_savings: defaultAnnualSavings,
        };
      })
    );
  }, [inputs.existing_heating_system, inputs.existing_glazing, inputs.existing_loft_insulation]);

  useEffect(() => {
    const multiplier = getHomeSizeMultiplier(inputs.home_size);
    setMeasures(prevMeasures =>
      prevMeasures.map(measure => {
        if (measure.name && measureDefaults[measure.name.toLowerCase()]) {
          const defaults = measureDefaults[measure.name.toLowerCase()];
          return {
            ...measure,
            installation_cost: defaults.installation_cost 
              ? parseFloat(defaults.installation_cost) * multiplier
              : measure.installation_cost,
            annual_savings: defaults.annual_savings 
              ? parseFloat(defaults.annual_savings) * multiplier
              : measure.annual_savings,
          };
        }
        return measure;
      })
    );
  }, [inputs.home_size]);

  // Derived calculation for Loan Amount
  const calculatedLoanAmount = (
    parseFloat(inputs.installation_cost || 0) -
    parseFloat(inputs.down_payment || 0) -
    parseFloat(inputs.government_subsidy || 0)
  );

  // Main Calculation Function
  const recalc = useCallback(() => {
    setLoading(true);
    console.log("Original measures:", measures);
    
    const validMeasures = measures.filter((measure) => {
      const nameValid = measure.name.trim() !== "";
      const lifetimeNum = parseInt(measure.lifetime, 10);
      const lifetimeValid = !isNaN(lifetimeNum);
      const costValid = !isNaN(parseFloat(measure.installation_cost));
      const savingsValid = !isNaN(parseFloat(measure.annual_savings));
      return nameValid && lifetimeValid && costValid && savingsValid;
    });
    
    console.log("Valid measures:", validMeasures);
    
    const payload = {
      installation_cost: parseFloat(inputs.installation_cost),
      installation_lifetime: parseInt(inputs.installation_lifetime, 10),
      energy_savings_per_year: parseFloat(inputs.energy_savings_per_year),
      loan_interest_rate: parseFloat(inputs.loan_interest_rate) / 100,
      loan_term: parseInt(inputs.loan_term, 10),
      discount_rate: parseFloat(inputs.discount_rate) / 100,
      basic_energy_price_escalation: parseFloat(inputs.basic_energy_price_escalation) / 100,
      // Use the custom scenario data for energy escalation
      energy_price_escalation: customScenarios[`${selectedScenario}_custom`] || defaultScenarios[selectedScenario],
      down_payment: parseFloat(inputs.down_payment) || 0,
      government_subsidy: parseFloat(inputs.government_subsidy) || 0,
      home_size: inputs.home_size,
      existing_heating_system: inputs.existing_heating_system,
      use_advanced_form: activeTab === "advanced",
      measures: validMeasures.map(measure => ({
        name: measure.name,
        installation_cost: parseFloat(measure.installation_cost) + parseFloat(measure.ancillary_cost || 0),
        annual_savings: parseFloat(measure.annual_savings),
        lifetime: parseInt(measure.lifetime, 10)
      }))
    };
    
    console.log("Payload:", payload);
    
    axios
      .post('./api/calculate', payload)
      .then(response => {
        console.log("Response:", response.data);
        setResults(response.data);
        setErrorMessage('');
      })
      .catch(error => console.error('Error making API call:', error))
      .finally(() => setLoading(false));

  }, [inputs, activeTab, measures, customScenarios, selectedScenario]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const installationCost = parseFloat(inputs.installation_cost);
    const installationLifetime = parseInt(inputs.installation_lifetime);
    const energySavings = parseFloat(inputs.energy_savings_per_year);
    const upfrontPayments = parseFloat(inputs.down_payment) || "0" + parseFloat(inputs.government_subsidy) || "0";

    if (!installationCost || installationCost === 0) {
      setErrorMessage("Please provide valid value for Installation Cost");
      return;
    }
    if (!installationLifetime || installationLifetime === 0) {
      setErrorMessage("Please provide valid value for Installation Lifetime");
      return;
    }
    if (!energySavings) {
      setErrorMessage("Please provide valid value for Energy Savings Per Year");
      return;
    }
    if (upfrontPayments > installationCost) {
      setErrorMessage("The Upfront Payments are greater than the Installation Cost");
      return;
    }

    recalc();
  };

  return (
    <div className="calculator">
      <TabHeader 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        activeAdvancedTab={activeAdvancedTab} setActiveAdvancedTab={setActiveAdvancedTab}
      />

      {activeTab === "advanced" && activeAdvancedTab === "property" && (
        <PropertyForm
          inputs={inputs}
          handleChange={handleChange}
        />
      )}

      {activeTab === "advanced" && activeAdvancedTab === "measures" && (
        <MeasuresForm
          inputs={inputs}
          handleChange={handleChange}
          measures={measures}
          handleMeasureChange={handleMeasureChange}
          addNewMeasure={addNewMeasure}
          handleRemoveMeasure={handleRemoveMeasure}
        />
      )}

      {activeTab === "advanced" && activeAdvancedTab === "energy" && (
        <EnergyForm
          selectedScenario={selectedScenario}
          customScenarioData={customScenarios[`${selectedScenario}_custom`] || defaultScenarios[selectedScenario]}
          onDataPointChange={(indexOrReset, newValue) => {
            const currentKey = `${selectedScenario}_custom`;
            if (indexOrReset === 'reset') {
              // Reset custom data from defaults
              setCustomScenarios(prev => ({
                ...prev,
                [currentKey]: [...defaultScenarios[selectedScenario]]
              }));
            } else {
              // Update a specific data point in custom data
              setCustomScenarios(prev => {
                const newCustom = prev[currentKey].map((val, i) =>
                  i === indexOrReset ? newValue : val
                );
                return {
                  ...prev,
                  [currentKey]: newCustom
                };
              });
            }
          }}
          onScenarioChange={(e) => setSelectedScenario(e.target.value)}
        />
      )}

      {activeTab === "advanced" && <hr />}

      <BasicForm
        inputs={inputs}
        handleChange={handleChange}
        calculatedLoanAmount={calculatedLoanAmount}
        handleSubmit={handleSubmit}
        applyDiscount={applyDiscount}
        handleApplyDiscountChange={handleApplyDiscountChange}
        advancedActive={activeTab === "advanced"}
        errorMessage={errorMessage}
        loading={loading}
      />

      {results && (
        <Results
          results={results}
          applyDiscount={applyDiscount}
          handleApplyDiscountChange={handleApplyDiscountChange}
        />
      )}
    </div>
  );
}

export default Calculator;
