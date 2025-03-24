// ✅ Function to Place Order
function placeOrder() {
    let customer = document.getElementById("customerName").value.trim();
    let products = document.getElementById("productList").value.split(",").map(p => p.trim());
    let total = parseFloat(document.getElementById("totalPrice").value);

    if (!customer || products.length === 0 || isNaN(total) || total <= 0) {
        alert("Please fill out all fields correctly.");
        return;
    }

    fetch('/place_order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, products, total })
    })
    .then(response => response.json())
    .then(data => {
        alert("Order Placed! Order ID: " + data.order_id);
        document.getElementById("orderForm").reset();
        window.location.href = "/orders"; // ✅ Redirect to orders page after placing an order
    })
    .catch(error => console.error('Error:', error));
}

// ✅ Function to List Orders
function listOrders() {
    fetch('/list_orders')
        .then(response => response.json())
        .then(data => {
            let ordersTable = document.getElementById("ordersTable");
            ordersTable.innerHTML = ""; // Clear existing table data

            if (data.length === 0) {
                ordersTable.innerHTML = "<tr><td colspan='4' class='text-center'>No orders found</td></tr>";
            } else {
                data.forEach(order => {
                    let row = `<tr>
                        <td>${order.id}</td>
                        <td>${order.customer}</td>
                        <td>${order.products.join(", ")}</td>
                        <td>$${order.total.toFixed(2)}</td>
                    </tr>`;
                    ordersTable.innerHTML += row;
                });
            }
        })
        .catch(error => {
            console.error("Error loading orders:", error);
            document.getElementById("ordersTable").innerHTML = "<tr><td colspan='4' class='text-danger'>Error loading orders</td></tr>";
        });
}

// ✅ Load orders when the page loads
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("ordersTable")) {
        listOrders();
        setInterval(listOrders, 3000); // ✅ Auto-refresh every 3 seconds
    }
});
