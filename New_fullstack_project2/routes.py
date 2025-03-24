from flask import Blueprint, request, jsonify, render_template
from db import connect_db
import uuid
import json

routes = Blueprint('routes', __name__)

@routes.route("/")
def index():
    return render_template("index.html")

@routes.route("/orders")
def orders_page():
    return render_template("table.html")

@routes.route("/place_order", methods=["POST"])
def place_order():
    data = request.json
    order_id = str(uuid.uuid4())

    conn = connect_db()
    cursor = conn.cursor()
    
    cursor.execute("INSERT INTO orders (id, customer, products, total) VALUES (?, ?, ?, ?)", 
                   (order_id, data["customer"], json.dumps(data["products"]), data["total"]))
    
    conn.commit()
    conn.close()

    return jsonify({"message": "Order placed", "order_id": order_id})


@routes.route("/list_orders", methods=["GET"])
def list_orders():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders")
    orders = cursor.fetchall()
    conn.close()

    # Convert orders to JSON
    orders_list = [
        {"id": order[0], "customer": order[1], "products": json.loads(order[2]), "total": order[3]}
        for order in orders
    ]

    return jsonify(orders_list)



@routes.route("/cancel_order/<order_id>", methods=["DELETE"])
def cancel_order(order_id):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM orders WHERE id = ?", (order_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Order cancelled"})

@routes.route("/summary/<customer>", methods=["GET"])
def summary(customer):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders WHERE customer = ?", (customer,))
    orders = cursor.fetchall()
    conn.close()
    return jsonify(orders)

@routes.route("/total_cost", methods=["GET"])
def total_cost():
    conn = connect_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT SUM(total) FROM orders")
    total = cursor.fetchone()[0]
    
    conn.close()
    
    return jsonify({"total_cost": total if total else 0})
