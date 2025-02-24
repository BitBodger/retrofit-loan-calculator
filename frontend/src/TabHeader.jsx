import PropTypes from 'prop-types';

function TabHeader({ activeTab, setActiveTab }) {
  return (
    <div className="tabs">
      <button 
        onClick={() => setActiveTab("basic")} 
        className={activeTab === "basic" ? "active" : ""}
      >
        Basic
      </button>
      <button 
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
