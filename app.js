// Toggle hamburger menu visibility
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
}

// Switch between tabs
function switchTab(tabName) {
    // Hide all tab contents
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.add('hidden'));

    // Show the selected tab
    const selectedTab = document.getElementById(tabName);
    selectedTab.classList.remove('hidden');
}

// Placeholder for calculation functions
function calculateSIP() { alert('Calculating SIP...'); }
function calculateLumpsum() { alert('Calculating Lumpsum...'); }
function calculateSWP() { alert('Calculating SWP...'); }
function calculateInflation() { alert('Calculating Inflation...'); }


// Switch between tabs
function switchTab(tab) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tabContent => {
        tabContent.classList.add('hidden');
    });
    document.getElementById(tab).classList.remove('hidden');
}

// Functions to calculate SIP, Lumpsum, SWP, and Inflation (You can replace these with your own calculations)
function calculateSIP() {
    // Placeholder for SIP calculation logic
    document.getElementById('sipResult').innerHTML = 'SIP Calculation Result will appear here.';
}

function calculateLumpsum() {
    // Placeholder for Lumpsum calculation logic
    document.getElementById('lumpsumResult').innerHTML = 'Lumpsum Calculation Result will appear here.';
}

function calculateSWP() {
    // Placeholder for SWP calculation logic
    document.getElementById('swpResult').innerHTML = 'SWP Calculation Result will appear here.';
}

function calculateInflation() {
    // Placeholder for Inflation calculation logic
    document.getElementById('inflationResult').innerHTML = 'Inflation Calculation Result will appear here.';
}

// Toggle fields based on the selected calculation type in Inflation tab
function toggleFields() {
    const calculationType = document.getElementById('calculationType').value;
    document.getElementById('initialAmountField').classList.toggle('hidden', calculationType !== 'presentValue');
    document.getElementById('futureAmountField').classList.toggle('hidden', calculationType !== 'futureValue');
    document.getElementById('inflationRateField').classList.toggle('hidden', calculationType !== 'inflationRate');
}


// Format input values with commas
function formatWithCommas(input) {
    const caretPosition = input.selectionStart;
    let value = input.value.replace(/,/g, '');
    if (!/^\d*$/.test(value)) {
        input.value = value.replace(/\D/g, '');
        return;
    }
    if (value !== '') {
        input.value = new Intl.NumberFormat('en-IN').format(value);
    }
    const newPosition = caretPosition + (input.value.length - value.length);
    input.setSelectionRange(newPosition, newPosition);
}

// Format currency in Lakhs and Crores
function formatCurrency(amount) {
    if (amount >= 10000000) {
        return `₹${(amount / 10000000).toFixed(2)} Crores`;
    } else if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(2)} Lakhs`;
    } else {
        return `₹${amount.toFixed(2)}`;
    }
}

// SIP Calculation
function calculateSIP() {
    const sipAmount = parseFloat(document.getElementById('sipAmount').value.replace(/,/g, '')) || 0;
    const interestRate = parseFloat(document.getElementById('sipInterestRate').value) || 0;
    const tenure = parseInt(document.getElementById('sipTenure').value) || 0;
    const inflationRate = parseFloat(document.getElementById('sipInflationRate').value) || 0;
    const stepUpRate = parseFloat(document.getElementById('sipStepUpRate').value) || 0;


    let totalInvestment = 0;
    let maturityValue = 0;
    let periods = tenure * 12;
    let currentSIP = sipAmount;
    let lastYearInvestment = 0;
    const monthlyRate = interestRate / 100 / 12;
    const monthlyInflationRate = inflationRate / 100 / 12;

    for (let year = 0; year < tenure; year++) {
        for (let month = 0; month < 12; month++) {
            totalInvestment += currentSIP;
            maturityValue += currentSIP * Math.pow((1 + monthlyRate), periods - (year * 12 + month));

            // Track the last year's investment
            if (year === tenure - 1) {
                lastYearInvestment += currentSIP;
            }
        }
        currentSIP *= (1 + stepUpRate / 100);
    }

    const inflationAdjustedValue = maturityValue / Math.pow((1 + monthlyInflationRate), periods);
    const totalGrowth = maturityValue - totalInvestment;

    const result = `
        <strong>SIP Calculation Result:</strong><br>
        Total Investment: ${formatCurrency(totalInvestment)}<br>
        Maturity Value: ${formatCurrency(maturityValue)}<br>
        Inflation-Adjusted Maturity Value: ${formatCurrency(inflationAdjustedValue)}<br>
        Total Growth: ${formatCurrency(totalGrowth)}<br>
        Total Monthly SIP Investment in Last Year: ${formatCurrency((lastYearInvestment) / 12)}<br>
    `;
    document.getElementById('sipResult').innerHTML = result;
    saveToHistory(result);
}

// Lumpsum Calculation
function calculateLumpsum() {
    const lumpsumAmount = parseFloat(document.getElementById('lumpsumAmount').value.replace(/,/g, '')) || 0;
    const interestRate = parseFloat(document.getElementById('lumpsumInterestRate').value) || 0;
    const tenure = parseInt(document.getElementById('lumpsumTenure').value) || 0;
    const inflationRate = parseFloat(document.getElementById('lumpsumInflationRate').value) || 0;

    const maturityValue = lumpsumAmount * Math.pow((1 + interestRate / 100), tenure);
    const inflationAdjustedValue = maturityValue / Math.pow((1 + inflationRate / 100), tenure);
    const totalGrowth = maturityValue - lumpsumAmount;

    const result = `
        <strong>Lumpsum Calculation Result:</strong><br>
        Total Investment: ${formatCurrency(lumpsumAmount)}<br>
        Maturity Value: ${formatCurrency(maturityValue)}<br>
        Inflation-Adjusted Value: ${formatCurrency(inflationAdjustedValue)}<br>
        Total Growth: ${formatCurrency(totalGrowth)}<br>
    `;
    document.getElementById('lumpsumResult').innerHTML = result;
    saveToHistory(result);
}

// SWP Calculation
function calculateSWP() {

    const investmentAmount = parseFloat(document.getElementById('swpInvestment').value.replace(/,/g, '')) || 0
    const interestRate = parseFloat(document.getElementById('swpInterestRate').value);
    const initialWithdrawal = parseFloat(document.getElementById('swpWithdrawal').value.replace(/,/g, '')) || 0
    const inflationRate = parseFloat(document.getElementById('swpInflationRate').value);
    const stepUpRate = parseFloat(document.getElementById('swpStepUp').value);

    let totalWithdrawn = 0;
    let currentWithdrawal = initialWithdrawal;
    let remainingAmount = investmentAmount;
    let years = 0;
    let lastYearWithdrawals = []; // Array to store the withdrawals of the last year

    while (remainingAmount >= currentWithdrawal) {
        let annualWithdrawals = []; // Temporary array to track withdrawals in the current year
        for (let month = 0; month < 12; month++) {
            if (remainingAmount < currentWithdrawal) break;
            totalWithdrawn += currentWithdrawal;
            remainingAmount = (remainingAmount - currentWithdrawal) * (1 + interestRate / 100 / 12);
            annualWithdrawals.push(currentWithdrawal); // Add the monthly withdrawal to the annual array
        }
        currentWithdrawal *= (1 + stepUpRate / 100);
        lastYearWithdrawals = annualWithdrawals; // Update the last year withdrawals
        years++;
    }

    // Calculate the average monthly withdrawal for the last year
    const averageMonthlyWithdrawalLastYear = lastYearWithdrawals.reduce((sum, amt) => sum + amt, 0) / lastYearWithdrawals.length;

    const result = `
        <strong>SWP Calculation Result:</strong><br>
        Total Withdrawn: ${formatCurrency(totalWithdrawn)}<br>
        Remaining Amount: ${formatCurrency(remainingAmount)}<br>
        Years of Withdrawals Possible: ${years}<br>
        Average Monthly Withdrawal in Last Year: ${formatCurrency(averageMonthlyWithdrawalLastYear)}<br>
    `;
    document.getElementById('swpResult').innerHTML = result;
    saveToHistory(result);
}


// Inflation calculation logic
function calculateInflation() {
    const calculationType = document.getElementById('calculationType').value;

    // Getting values from input fields
    const initialAmount = parseFloat(document.getElementById('initialAmount').value.replace(/,/g, '')) || 0;
    const futureAmount = parseFloat(document.getElementById('futureAmount').value.replace(/,/g, '')) || 0;
    const inflationRate = parseFloat(document.getElementById('inflationRate').value) || 0;
    const timePeriod = parseFloat(document.getElementById('timeperiod').value) || 0;

    let result = '';

    if (calculationType === 'futureValue') {
        if (isNaN(initialAmount) || isNaN(inflationRate) || isNaN(timePeriod)) {
            result = 'Please enter valid initial amount, inflation rate, and time period.';
        } else {
            const futureValue = initialAmount * Math.pow(1 + inflationRate / 100, timePeriod);
            price = formatCurrency(futureValue);
            result = `Future Value after ${timePeriod} years: ${price}`;
        }
    } else if (calculationType === 'presentValue') {
        if (isNaN(futureAmount) || isNaN(inflationRate) || isNaN(timePeriod)) {
            result = 'Please enter valid future value, inflation rate, and time period.';
        } else {
            const presentValue = futureAmount / Math.pow(1 + inflationRate / 100, timePeriod);
            result = `Present Value: ${formatCurrency(presentValue)}`;
        }
    } else if (calculationType === 'inflationRate') {
        if (isNaN(initialAmount) || isNaN(futureAmount) || isNaN(timePeriod)) {
            result = 'Please enter valid initial amount, future value, and time period.';
        } else {
            const calculatedInflationRate = (Math.pow(futureAmount / initialAmount, 1 / timePeriod) - 1) * 100;
            result = `Calculated Inflation Rate: ${formatCurrency(calculatedInflationRate)}%`;
        }
    } else {
        result = 'Please select a valid calculation type.';
    }



    // Display the result
    document.getElementById('inflationResult').innerHTML = result;
    saveToHistory(result);

}

// Toggle input fields based on selected calculation type
function toggleFields() {
    const calculationType = document.getElementById('calculationType').value;

    // Hide all fields initially
    document.getElementById('initialAmountField').classList.add('hidden');
    document.getElementById('futureAmountField').classList.add('hidden');
    document.getElementById('inflationRateField').classList.add('hidden');
    document.getElementById('timeField').classList.add('hidden');

    // Show relevant fields based on the calculation type
    if (calculationType === 'futureValue') {
        document.getElementById('initialAmountField').classList.remove('hidden');
        document.getElementById('inflationRateField').classList.remove('hidden');
        document.getElementById('timeField').classList.remove('hidden');
    } else if (calculationType === 'presentValue') {
        document.getElementById('futureAmountField').classList.remove('hidden');
        document.getElementById('inflationRateField').classList.remove('hidden');
        document.getElementById('timeField').classList.remove('hidden');
    } else if (calculationType === 'inflationRate') {
        document.getElementById('initialAmountField').classList.remove('hidden');
        document.getElementById('futureAmountField').classList.remove('hidden');
        document.getElementById('timeField').classList.remove('hidden');
    }
}

// Initialize default view
toggleFields();



// Function to add to history
function addToHistory(type, result) {
    const history = document.getElementById('history');
    const entry = document.createElement('div');
    entry.innerText = `${type}: ${formatAmount(result)}`;
    history.appendChild(entry);
}


// Save a calculation result to history
function saveToHistory(result) {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.push(result);
    localStorage.setItem('history', JSON.stringify(history));
    loadHistory();
}

// Load and display history
function loadHistory() {
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = ''; // Clear existing history

    const history = JSON.parse(localStorage.getItem('history')) || [];
    if (history.length === 0) {
        historyContainer.innerHTML = '<p class="text-gray-500">No history available.</p>';
        return;
    }

    history.forEach(entry => {
        const p = document.createElement('p');
        p.className = "bg-white p-2 rounded shadow mb-2";
        p.innerHTML = entry;
        historyContainer.appendChild(p);
    });
}

// Clear the history
function clearHistory() {
    localStorage.removeItem('history');
    loadHistory();
}

// Load history on page load
document.addEventListener('DOMContentLoaded', loadHistory);


// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('input', event => formatWithCommas(event.target));
    });

    document.getElementById('calculateSipButton')?.addEventListener('click', calculateSIP);
    document.getElementById('calculateLumpsumButton')?.addEventListener('click', calculateLumpsum);
    document.getElementById('calculateSwpButton')?.addEventListener('click', calculateSWP);

    loadHistory();
});


