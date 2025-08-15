let expenses = [];
let chart;

document.getElementById("add-btn").addEventListener("click", function () {
    let category = document.getElementById("category-select").value;
    let amount = document.getElementById("amount-input").value;
    let date = document.getElementById("date-input").value;

    if (amount && category && date) {
        addExpense(amount, category, date);

        // Clear inputs after adding
        document.getElementById("amount-input").value = "";
        document.getElementById("date-input").value = "";
    }
});

function addExpense(amount, category, date) {
    expenses.push({ amount: parseFloat(amount), category, date });
    updateTable();
    updateChart();
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateTable();
    updateChart();
}

function updateTable() {
    let tableBody = document.getElementById("expense-table-body");
    tableBody.innerHTML = "";

    let total = 0;

    expenses.forEach((exp, index) => {
        let row = `<tr>
            <td>${exp.category}</td>
            <td>${exp.amount}</td>
            <td>${exp.date}</td>
            <td><button onclick="deleteExpense(${index})">Delete</button></td>
        </tr>`;
        tableBody.innerHTML += row;
        total += exp.amount;
    });

    document.getElementById("total-amount").textContent = total.toFixed(2);
}

function updateChart() {
    let categoryTotals = {};
    expenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const ctx = document.getElementById('expenseChart').getContext('2d');

    if (chart) chart.destroy(); // Destroy old chart before creating new one

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
        }
    });
}
