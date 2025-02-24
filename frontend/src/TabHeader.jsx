import PropTypes from 'prop-types';

function TabHeader({ activeTab, setActiveTab }) {
  return (
    <div className="tabs">
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
  );
}

TabHeader.propTypes = {
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.string
}

export default TabHeader;
