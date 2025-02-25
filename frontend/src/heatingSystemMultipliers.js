const heatingSystemMultipliers = {
  old_oil_boiler: 1.3,      // 30% higher savings if replacing an old oil boiler
  old_gas_boiler: 1.2,      // 20% higher savings if replacing an old gas boiler
  efficient_boiler: 0.9,    // 10% lower savings if replacing an efficient boiler
  new_gas_boiler: 0.9,      // similar for new gas boiler
  // Other heating system types...
};

export default heatingSystemMultipliers;
