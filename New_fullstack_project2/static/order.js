document.addEventListener("DOMContentLoaded", function () {
    fetch("/list_orders") // Fetch orders from the backend
        .then(response => response.json())
        .then(data => {
            let ordersTable = document.getElementById("ordersTable");
            ordersTable.innerHTML = ""; // Clear "Loading orders..."

            if (data.length === 0) {
                ordersTable.innerHTML = "<tr><td colspan='4'>No orders found</td></tr>";
                return;
            }

            data.forEach(order => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${order.id}</td> 
                    <td>${order.customer}</td>
                    <td>${order.products}</td>
                    <td>${order.total}</td>
                `;
                ordersTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error fetching orders:", error);
            document.getElementById("ordersTable").innerHTML = "<tr><td colspan='4'>Error loading orders</td></tr>";
        });
});
