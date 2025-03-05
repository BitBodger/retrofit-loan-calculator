import PropTypes from 'prop-types';

function TabHeader({ activeTab, setActiveTab, activeAdvancedTab, setActiveAdvancedTab }) {
  return (
    <div> 
      <div className={activeTab === "advanced" ? "inactive-tabs" : "active-tabs"}>
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
          Advanced
        </button>
        <hr />
      </div>
      {
        activeTab == "advanced" && (
          <div className="active-tabs">
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
            <hr />
          </div>
        )
      }

    </div> 
  );
}

TabHeader.propTypes = {
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func,
  activeAdvancedTab: PropTypes.string,
  setActiveAdvancedTab: PropTypes.func
}

export default TabHeader;
