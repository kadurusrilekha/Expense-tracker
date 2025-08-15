let expenses = [];
let chart;

// Get all input elements
const categorySelect = document.getElementById("category-select");
const amountInput = document.getElementById("amount-input");
const dateInput = document.getElementById("date-input");

// Add button still adds expense to the list
document.getElementById("add-btn").addEventListener("click", function () {
    const category = categorySelect.value;
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;

    if (!category || !amount || !date || amount <= 0) {
        alert("Please enter valid details.");
        return;
    }

    addExpense(amount, category, date);

    // Clear inputs
    amountInput.value = "";
    dateInput.value = "";
});

// Live preview: chart updates as user types/selects
amountInput.addEventListener("input", liveUpdateChart);
categorySelect.addEventListener("change", liveUpdateChart);

function liveUpdateChart() {
    const category = categorySelect.value;
    const amount = parseFloat(amountInput.value);

    if (!category || isNaN(amount) || amount <= 0) return;

    // Create a temporary array for live preview
    const tempExpenses = [...expenses, { category, amount, date: dateInput.value || "N/A" }];

    updateChart(tempExpenses);
}

function addExpense(amount, category, date) {
    expenses.push({ amount, category, date });
    updateTable();
    updateChart(expenses);
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateTable();
    updateChart(expenses);
}

function updateTable() {
    const tableBody = document.getElementById("expense-table-body");
    tableBody.innerHTML = "";

    let total = 0;
    expenses.forEach((exp, index) => {
        total += exp.amount;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${exp.category}</td>
            <td>${exp.amount.toFixed(2)}</td>
            <td>${exp.date}</td>
            <td><button onclick="deleteExpense(${index})" class="delete-btn">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById("total-amount").textContent = total.toFixed(2);
}

function updateChart(data) {
    const categoryTotals = {};
    data.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const ctx = document.getElementById('expenseChart').getContext('2d');

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56',
                    '#4BC0C0', '#9966FF', '#FF9F40'
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
}
