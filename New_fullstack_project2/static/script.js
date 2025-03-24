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
        listOrders(); // Refresh the order table
        updateTotalCost(); // Update the total cost field
    })
    .catch(error => console.error('Error:', error));
}


// ✅ Function to List Orders
// ✅ Function to List Orders with Delete Button
function listOrders() {
    fetch('/list_orders')
        .then(response => response.json())
        .then(data => {
            let ordersTable = document.getElementById("ordersTable");
            ordersTable.innerHTML = ""; // Clear existing table data

            if (data.length === 0) {
                ordersTable.innerHTML = "<tr><td colspan='5' class='text-center'>No orders found</td></tr>";
            } else {
                data.forEach(order => {
                    let row = `<tr>
                        <td>${order.id}</td>
                        <td>${order.customer}</td>
                        <td>${order.products.join(", ")}</td>
                        <td>$${order.total.toFixed(2)}</td>
                        <td><button class="btn btn-danger btn-sm" onclick="deleteOrder('${order.id}')">Delete</button></td>
                    </tr>`;
                    ordersTable.innerHTML += row;
                });
            }
        })
        .catch(error => {
            console.error("Error loading orders:", error);
            document.getElementById("ordersTable").innerHTML = "<tr><td colspan='5' class='text-danger'>Error loading orders</td></tr>";
        });
}

// ✅ Function to Delete an Order
function deleteOrder(orderId) {
    if (confirm("Are you sure you want to delete this order?")) {
        fetch(`/cancel_order/${orderId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            listOrders(); // Refresh the table
            updateTotalCost(); // Update total cost
        })
        .catch(error => console.error("Error deleting order:", error));
    }
}

// ✅ Function to Fetch Total Cost
function updateTotalCost() {
    fetch('/total_cost')
        .then(response => response.json())
        .then(data => {
            document.getElementById("totalCost").value = `$${data.total_cost.toFixed(2)}`;
        })
        .catch(error => console.error("Error fetching total cost:", error));
}

// ✅ Auto-Update Total Cost When Orders Are Listed
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("ordersTable")) {
        listOrders();
        setInterval(listOrders, 3000);
    }
    updateTotalCost();
});


// ✅ Load orders when the page loads
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("ordersTable")) {
        listOrders();
        setInterval(listOrders, 3000); // ✅ Auto-refresh every 3 seconds
    }
});
