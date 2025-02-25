from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List

app = FastAPI()

# Allow cross-origin requests from the frontend development server.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Data Models
# -----------------------------

class Measure(BaseModel):
    name: str
    installation_cost: float
    repairs_and_enabling_works_cost: float
    annual_savings: float
    lifetime: int    

class CalculationRequest(BaseModel):
    installation_cost: float
    installation_lifetime: int 
    energy_savings_per_year: float  
    loan_interest_rate: float  
    loan_term: int              
    discount_rate: float        
    energy_price_escalation: float
    down_payment: float
    government_subsidy: float
    use_advanced_form: bool
    measures: Optional[List[Measure]] = None

class YearlyCashFlow(BaseModel):
    year: int
    annual_loan_payment: float
    remaining_loan_balance: float
    interest_portion: float
    principal_portion: float
    annual_energy_savings: float
    discount_factor: float
    net_cash_flow: float
    discounted_net_cash_flow: float
    cumulative_net_cash_flow: float
    discounted_cumulative_net_cash_flow: float

class CalculationResponse(BaseModel):
    yearly_details: List[YearlyCashFlow]
    total_cost: float
    total_savings: float
    net_savings: float
    payback_time: int
    total_interest: float
    discounted_total_cost: float
    discounted_total_savings: float
    discounted_net_savings: float
    discounted_payback_time: int

# -----------------------------
# Helper Functions
# -----------------------------

def pmt(rate: float, nper: int, pv: float) -> float:
    """
    Calculate the fixed payment (PMT) for a loan with constant interest and payments.

    Parameters:
      rate (float): Interest rate per period (for monthly calculations, use the monthly rate).
      nper (int): Total number of payment periods.
      pv (float): Present value or principal.

    Returns:
      float: The payment amount as a negative number (representing cash outflow).
    """
    if rate == 0:
        return -pv / nper
    return -(pv * rate * (1 + rate) ** nper) / ((1 + rate) ** nper - 1)

# -----------------------------
# Main Calculation Endpoint
# -----------------------------

@app.post("/api/calculate", response_model=CalculationResponse)
async def calculate(request: CalculationRequest):
    # Calculate the initial loan amount by subtracting the down payment and government subsidy
    # from the installation cost.
    loan_amount = request.installation_cost - request.down_payment - request.government_subsidy

    # Validate that the loan amount is positive. If not, return an error.
    if loan_amount <= 0:
        raise HTTPException(status_code=400, detail="Loan amount must be positive. Check down payment and subsidy.")

    # Convert the annual interest rate to a monthly rate.
    monthly_rate = request.loan_interest_rate / 12.0
    # Calculate the total number of monthly payment periods.
    total_months = request.loan_term * 12

    # Compute the fixed monthly payment using the PMT function.
    monthly_payment = -pmt(monthly_rate, total_months, loan_amount)

    # Initialize the remaining balance to the full loan amount.
    remaining_balance = loan_amount

    # Initialize lists and accumulators for yearly details and summary totals.
    yearly_details = []
    cumulative_net_cash_flow = 0.0
    discounted_cumulative_net_cash_flow = 0.0

    total_energy_savings = 0.0
    total_loan_payments = 0.0
    total_interest = 0.0
    payback_time = 0

    total_discounted_energy_savings = 0.0
    total_discounted_loan_payments = 0.0
    discounted_payback_time = 0

    # Track the overall month count across the repayment schedule.
    current_month = 0

    # Loop over each year of the installation's lifetime.
    for year in range(1, request.installation_lifetime + 1):
        annual_loan_payment = 0.0
        annual_interest = 0.0
        annual_principal = 0.0

        for m in range(1, 13):
            current_month += 1
            if current_month <= total_months:
                interest_payment = remaining_balance * monthly_rate
                principal_payment = monthly_payment - interest_payment
                remaining_balance -= principal_payment
                remaining_balance = max(0, remaining_balance)
                annual_loan_payment += monthly_payment
                annual_interest += interest_payment
                annual_principal += principal_payment
            else:
                break

        # Base energy savings using the global base rate.
        base_energy_savings = request.energy_savings_per_year * ((1 + request.energy_price_escalation) ** (year - 1))

        # Sum energy savings from measures that are still active this year.
        measure_energy_savings = 0.0
        if request.use_advanced_form and request.measures:
            for measure in request.measures:
                if year <= measure.lifetime:
                    measure_energy_savings += measure.annual_savings * ((1 + request.energy_price_escalation) ** (year - 1))
            annual_energy_savings = measure_energy_savings
            # Apply combined savings bonus if specific combinations exist.
            selected_measure_names = [m.name.lower() for m in request.measures]
            
            # Assume that measure_energy_savings is already the sum of all active measure savings.
            # We'll compute additional bonus savings based only on the measures in each combo.
            combined_savings_bonus = 0.0

            # Define your combo rules:
            combo_definitions = {
                ('solar_pv', 'heat_pump'): 0.1,
                ('solar_pv', 'battery'): 0.1,
            }

            # For each combo, check if all required measures are present and active for this year.
            for combo, bonus_pct in combo_definitions.items():
                # Check if all measures in the combo are active in the current year.
                if all(any(m.name.lower() == measure and year <= m.lifetime for m in request.measures) for measure in combo):
                    # Sum savings only from the measures in the combo.
                    combo_savings = sum(
                        m.annual_savings * ((1 + request.energy_price_escalation) ** (year - 1))
                        for m in request.measures 
                        if m.name.lower() in combo and year <= m.lifetime
                    )
                    combined_savings_bonus += bonus_pct * combo_savings

            # Apply the bonus only to the savings from the measures, not the base savings.
            annual_energy_savings = measure_energy_savings + combined_savings_bonus


        else:
            annual_energy_savings = base_energy_savings

        net_cash_flow = annual_energy_savings - annual_loan_payment
        discount_factor = 1 / ((1 + request.discount_rate) ** year)
        discounted_net_cash_flow = net_cash_flow * discount_factor

        cumulative_net_cash_flow += net_cash_flow
        discounted_cumulative_net_cash_flow += discounted_net_cash_flow

        total_energy_savings += annual_energy_savings
        total_loan_payments += annual_loan_payment
        total_interest += annual_interest

        total_discounted_energy_savings += annual_energy_savings * discount_factor
        total_discounted_loan_payments += annual_loan_payment * discount_factor

        if cumulative_net_cash_flow >= 0 and payback_time == 0:
            payback_time = year
        if discounted_cumulative_net_cash_flow >= 0 and discounted_payback_time == 0:
            discounted_payback_time = year

        yearly_detail = YearlyCashFlow(
            year=year,
            annual_loan_payment=round(annual_loan_payment, 2),
            remaining_loan_balance=round(remaining_balance, 2),
            interest_portion=round(annual_interest, 2),
            principal_portion=round(annual_principal, 2),
            annual_energy_savings=round(annual_energy_savings, 2),
            discount_factor=round(discount_factor, 2),
            net_cash_flow=round(net_cash_flow, 2),
            discounted_net_cash_flow=round(discounted_net_cash_flow, 2),
            cumulative_net_cash_flow=round(cumulative_net_cash_flow, 2),
            discounted_cumulative_net_cash_flow=round(discounted_cumulative_net_cash_flow, 2)
        )
        yearly_details.append(yearly_detail)


    # ----------------------------------
    # Summary Totals Calculations
    # ----------------------------------

    # Nominal Total Cost:
    # - Down payment is paid upfront (not financed).
    # - Loan amount and total interest represent the cost of financing.
    total_cost = request.down_payment + loan_amount + total_interest

    total_savings = total_energy_savings
    net_savings = total_savings - total_cost

    # Discounted Total Cost:
    # - Down payment remains undiscounted (paid immediately).
    # - The sum of loan amount and total interest is discounted over the loan term.
    discounted_total_cost = request.down_payment + ((loan_amount + total_interest) / ((1 + request.discount_rate) ** request.loan_term))

    discounted_total_savings = total_discounted_energy_savings
    discounted_net_savings = discounted_total_savings - discounted_total_cost

    # ----------------------------------
    # Return the Calculation Response
    # ----------------------------------

    return CalculationResponse(
        yearly_details=yearly_details,
        total_cost=round(total_cost, 2),
        total_savings=round(total_savings, 2),
        net_savings=round(net_savings, 2),
        payback_time=payback_time,
        discounted_total_cost=round(discounted_total_cost, 2),
        discounted_total_savings=round(discounted_total_savings, 2),
        discounted_net_savings=round(discounted_net_savings, 2),
        discounted_payback_time=discounted_payback_time,
        total_interest=round(total_interest, 2)
    )
