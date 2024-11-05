// Toggle dropdown menu position based on button click location
function toggleDropdown(button) {
    const dropdown = document.getElementById("dropdownMenu");

    if (dropdown.style.display === "none" || dropdown.style.display === "") {
        // Calculate the position of the button and set dropdown menu position
        const rect = button.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom + window.scrollY}px`;
        dropdown.style.left = `${rect.left + window.scrollX}px`;

        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "none";
    }
}

// Switch between tabs for SIP, Lumpsum, and SWP calculations
function switchTab(tabId) {
    document.querySelectorAll('.tab-pane').forEach(tab => tab.classList.remove('show', 'active'));

    const selectedTab = document.getElementById(tabId);
    selectedTab.classList.add('show', 'active');

    document.getElementById("dropdownMenu").style.display = "none";
}

// Function to change theme
function changeTheme() {
    const selectedTheme = document.getElementById("themeSelect").value;

    // Remove any previously applied theme classes
    document.body.classList.remove(
        "purple-theme",
        "light-theme",
        "dark-theme",
        "blue-theme",
        "green-theme",
        "red-theme",
        "teal-theme",
        "orange-theme",
        "yellow-theme",
        "pink-theme"
    );

    // Add the selected theme class to the body
    document.body.classList.add(selectedTheme);
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

// Save and load history for calculations
function saveToHistory(result) {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.push(result);
    localStorage.setItem('history', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = '';
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.forEach(entry => {
        const p = document.createElement('p');
        p.innerHTML = entry;
        historyContainer.appendChild(p);
    });
}

function clearHistory() {
    localStorage.removeItem('history');
    loadHistory();
}

// SIP calculation
function calculateSIP() {
    const sipAmount = parseFloat(document.getElementById('sipAmount').value);
    const interestRate = parseFloat(document.getElementById('sipInterestRate').value);
    const tenure = parseInt(document.getElementById('sipTenure').value);
    const inflationRate = parseFloat(document.getElementById('sipInflationRate').value);
    const stepUpRate = parseFloat(document.getElementById('sipStepUpRate').value);

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
        Total SIP Investment in Last Year: ${formatCurrency((lastYearInvestment) / 12)}<br>
    `;
    document.getElementById('sipResult').innerHTML = result;
    saveToHistory(result);
}

// Lumpsum calculation
function calculateLumpsum() {
    const lumpsumAmount = parseFloat(document.getElementById('lumpsumAmount').value);
    const interestRate = parseFloat(document.getElementById('lumpsumInterestRate').value);
    const tenure = parseInt(document.getElementById('lumpsumTenure').value);
    const inflationRate = parseFloat(document.getElementById('lumpsumInflationRate').value);

    const maturityValue = lumpsumAmount * Math.pow((1 + interestRate / 100), tenure);
    const inflationAdjustedValue = maturityValue / Math.pow((1 + inflationRate / 100), tenure);
    const totalGrowth = maturityValue - lumpsumAmount;

    const result = `
        <strong>Lumpsum Calculation Result:</strong><br>
        Total Investment: ${formatCurrency(lumpsumAmount)}<br>
        Maturity Value: ${formatCurrency(maturityValue)}<br>
        Inflation-Adjusted Maturity Value: ${formatCurrency(inflationAdjustedValue)}<br>
        Total Growth: ${formatCurrency(totalGrowth)}<br>
    `;
    document.getElementById('lumpsumResult').innerHTML = result;
    saveToHistory(result);
}

// SWP calculation
function calculateSWP() {
    const investmentAmount = parseFloat(document.getElementById('swpInvestment').value);
    const interestRate = parseFloat(document.getElementById('swpInterestRate').value);
    const initialWithdrawal = parseFloat(document.getElementById('swpWithdrawal').value);
    const inflationRate = parseFloat(document.getElementById('swpInflationRate').value);
    const stepUpRate = parseFloat(document.getElementById('swpStepUp').value);

    let totalWithdrawn = 0;
    let currentWithdrawal = initialWithdrawal;
    let remainingAmount = investmentAmount;
    let years = 0;
    let lastYearWithdrawals = [];

    while (remainingAmount >= currentWithdrawal) {
        let annualWithdrawals = [];
        for (let month = 0; month < 12; month++) {
            if (remainingAmount < currentWithdrawal) break;
            totalWithdrawn += currentWithdrawal;
            remainingAmount = (remainingAmount - currentWithdrawal) * (1 + interestRate / 100 / 12);
            annualWithdrawals.push(currentWithdrawal);
        }
        currentWithdrawal *= (1 + stepUpRate / 100);
        lastYearWithdrawals = annualWithdrawals;
        years++;
    }

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

// Toggle fields based on selected calculation type
function toggleFields() {
    const calculationType = document.getElementById("calculationType").value;
    document.getElementById("initialAmountField").style.display = calculationType === "futureValue" || calculationType === "inflationRate" ? "block" : "none";
    document.getElementById("futureAmountField").style.display = calculationType === "presentValue" || calculationType === "inflationRate" ? "block" : "none";
    document.getElementById("inflationRateField").style.display = calculationType === "futureValue" || calculationType === "presentValue" ? "block" : "none";
    document.getElementById("yearsField").style.display = "block";
}

// Calculate based on selected option
// Function to calculate based on selected option
function calculate() {
    const calculationType = document.getElementById("calculationType").value;
    const initialAmount = parseFloat(document.getElementById("initialAmount").value);
    const futureAmount = parseFloat(document.getElementById("futureAmount").value);
    const inflationRate = parseFloat(document.getElementById("inflationRate").value);
    const years = parseInt(document.getElementById("years").value);
    let result;

    if (calculationType === "futureValue") {
        // Calculate Future Value
        result = initialAmount * Math.pow((1 + inflationRate / 100), years);
        document.getElementById("resultText").textContent = `Future Value: ₹${result.toFixed(2)}`;
    } else if (calculationType === "presentValue") {
        // Calculate Present Value
        result = futureAmount / Math.pow((1 + inflationRate / 100), years);
        document.getElementById("resultText").textContent = `Present Value: ₹${result.toFixed(2)}`;
    } else if (calculationType === "inflationRate") {
        // Calculate Inflation Rate needed to reach Future Amount from Initial Amount
        result = (Math.pow(futureAmount / initialAmount, 1 / years) - 1) * 100;
        document.getElementById("resultText").textContent = `Required Inflation Rate: ${result.toFixed(2)}%`;
    }

    document.getElementById("result").style.display = "block";
}

// Load history on page load
window.onload = loadHistory;