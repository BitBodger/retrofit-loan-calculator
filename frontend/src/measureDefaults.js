const measureDefaults = {
  loft_insulation_top_up: {
    installation_cost: 500,
    annual_savings: 300,
    lifetime: 40,
  },
  cavity_wall_insulation: {
    installation_cost: 1000,
    annual_savings: 300,
    lifetime: 30,
  },
  solid_wall_insulation: {
    installation_cost: 15000,
    annual_savings: 450,
    lifetime: 30,
  },
  draught_proofing: {
    installation_cost: 250,
    annual_savings: 50,
    lifetime: 10,
  },
  double_glazing: {
    installation_cost: 5000,
    annual_savings: 150,
    lifetime: 20,
  },
  triple_glazing: {
    installation_cost: 7000,
    annual_savings: 250,
    lifetime: 20,
  },
  high_efficiency_boiler: {
    installation_cost: 3000,
    annual_savings: 300,
    lifetime: 15,
  },
  heating_controls: {
    installation_cost: 500,
    annual_savings: 150,
    lifetime: 20,
  },
  heat_pump: {
    installation_cost: 14000,
    annual_savings: 290,
    lifetime: 20,
    existingSystems: {
      old_gas_boiler: 290,
      new_gas_boiler: -3,
      old_oil_boiler: 280,
      new_oil_boiler: -55,
      old_lpg_boiler: 650,
      new_lpg_boiler: 260,
      old_electric_storage_heaters: 1200,
      new_electric_storage_heaters: 700,
      coal: 650
    }
  },
  solar_pv: {
    installation_cost: 7000,
    annual_savings: 650,
    lifetime: 25,
  },
};

export default measureDefaults;
