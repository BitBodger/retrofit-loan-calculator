from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Measure(BaseModel):
    name: str
    installation_cost: float
    repairs_and_enabling_works_cost: float
    annual_savings: float
    lifetime: int    

# Updated CalculationRequest includes discount_rate and energy_price_escalation.
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

# Model for each year's detailed cash flow.
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

# Updated CalculationResponse to include discounted summary values.
class CalculationResponse(BaseModel):
    yearly_details: List[YearlyCashFlow]
    total_cost: float
    total_savings: float
    net_savings: float
    payback_time: int
    discounted_total_cost: float
    discounted_total_savings: float
    discounted_net_savings: float
    discounted_payback_time: int

def pmt(rate: float, nper: int, pv: float) -> float:
    """
    Calculate the payment for a loan based on constant payments and a constant interest rate.
    
    rate: Interest rate per period (for monthly calculations, use the monthly rate).
    nper: Total number of payment periods.
    pv: Present value (or principal).
    
    Returns a negative value indicating an outflow.
    """
    if rate == 0:
        return -pv / nper
    return -(pv * rate * (1 + rate) ** nper) / ((1 + rate) ** nper - 1)

@app.post("/api/calculate", response_model=CalculationResponse)
async def calculate(request: CalculationRequest):
    # Subtract down payment and government subsidy from installation cost to get loan amount
    loan_amount = request.installation_cost - request.down_payment - request.government_subsidy

    # Convert the annual loan interest rate to a monthly rate.
    monthly_rate = request.loan_interest_rate / 12.0
    # Total number of monthly periods for the loan.
    total_months = request.loan_term * 12
    
    # Calculate the fixed monthly payment.
    monthly_payment = -pmt(monthly_rate, total_months, loan_amount)
    
    # We'll simulate the loan schedule month-by-month.
    remaining_balance = loan_amount
    
    # This list will store the yearly breakdown.
    yearly_details = []
    
    cumulative_net_cash_flow = 0.0
    discounted_cumulative_net_cash_flow = 0.0

    # For summary calculations (nominal)
    total_energy_savings = 0.0
    total_loan_payments = 0.0
    payback_time = 0
    # For discounted summary calculations
    total_discounted_energy_savings = 0.0
    total_discounted_loan_payments = 0.0
    discounted_payback_time = 0
    
    # We'll also keep track of the current month in the repayment schedule.
    current_month = 0
    
    for year in range(1, request.installation_lifetime + 1):
        annual_loan_payment = 0.0
        annual_interest = 0.0
        annual_principal = 0.0
        
        # Process each month for this year.
        for m in range(1, 13):
            current_month += 1
            if current_month <= total_months:
                # Calculate this month's interest.
                interest_payment = remaining_balance * monthly_rate
                # The principal portion is the monthly payment minus the interest.
                principal_payment = monthly_payment - interest_payment
                # Deduct the principal portion from the remaining balance.
                remaining_balance -= principal_payment
                
                annual_loan_payment += monthly_payment
                annual_interest += interest_payment
                annual_principal += principal_payment
            else:
                break
        
        # Calculate the annual energy savings, adjusted for energy price escalation.
        # Year 1 uses the base savings; subsequent years escalate cumulatively.
        annual_energy_savings = request.energy_savings_per_year * ((1 + request.energy_price_escalation) ** (year - 1))
        
        # Net cash flow for this year: savings minus loan payment.
        net_cash_flow = annual_energy_savings - annual_loan_payment
        
        # Calculate the discount factor for this year.
        discount_factor = 1 / ((1 + request.discount_rate) ** year)
        
        discounted_net_cash_flow = net_cash_flow * discount_factor
        
        cumulative_net_cash_flow += net_cash_flow
        discounted_cumulative_net_cash_flow += discounted_net_cash_flow

        # Accumulate summary values (nominal)
        total_energy_savings += annual_energy_savings
        total_loan_payments += annual_loan_payment
        # Accumulate summary values (discounted)
        total_discounted_energy_savings += annual_energy_savings * discount_factor
        total_discounted_loan_payments += annual_loan_payment * discount_factor
        # Find payback time
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

    # Nominal summary totals (immediate down payment is not discounted)
    total_cost = request.down_payment + total_loan_payments
    total_savings = total_energy_savings
    net_savings = total_savings - total_cost

    # Discounted summary totals: down payment is immediate so no discounting needed.
    discounted_total_cost = request.down_payment + total_discounted_loan_payments
    discounted_total_savings = total_discounted_energy_savings
    discounted_net_savings = discounted_total_savings - discounted_total_cost
    
    return CalculationResponse(
        yearly_details=yearly_details,
        total_cost=round(total_cost, 2),
        total_savings=round(total_savings, 2),
        net_savings=round(net_savings, 2),
        payback_time=payback_time,
        discounted_total_cost=round(discounted_total_cost, 2),
        discounted_total_savings=round(discounted_total_savings, 2),
        discounted_net_savings=round(discounted_net_savings, 2),
        discounted_payback_time=discounted_payback_time
    )
