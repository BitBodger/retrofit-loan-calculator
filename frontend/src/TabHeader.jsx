import PropTypes from 'prop-types';

function TabHeader({ activeTab, setActiveTab, activeAdvancedTab, setActiveAdvancedTab }) {
  return (
    <div>
      {/* Primary tab group: Basic vs. Designer */}
      <div className={`tab-bar ${activeTab === "advanced" ? "tab-shrink" : ""}`}>
        <button 
          data-dot="basic"
          onClick={() => setActiveTab("basic")} 
          className={activeTab === "basic" ? "active" : ""}
        >
          Basic
        </button>
        <button 
          data-dot="advanced"
          onClick={() => setActiveTab("advanced")} 
          className={activeTab === "advanced" ? "active" : ""}
        >
          Designer
        </button>
      </div>
      
      {/* Advanced sub-tabs appear only when the advanced tab is active */}
      {activeTab === "advanced" && (
        <div className="tab-bar">
          <button 
            data-dot="property"
            onClick={() => setActiveAdvancedTab("property")} 
            className={activeAdvancedTab === "property" ? "active" : ""}
          >
            Property
          </button>
          <button 
            data-dot="measures"
            onClick={() => setActiveAdvancedTab("measures")} 
            className={activeAdvancedTab === "measures" ? "active" : ""}
          >
            Measures
          </button>
          <button 
            data-dot="energy"
            onClick={() => setActiveAdvancedTab("energy")} 
            className={activeAdvancedTab === "energy" ? "active" : ""}
          >
            Energy Prices
          </button>
        </div>
      )}
    </div>
  );
}

TabHeader.propTypes = {
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func,
  activeAdvancedTab: PropTypes.string,
  setActiveAdvancedTab: PropTypes.func,
};

export default TabHeader;
