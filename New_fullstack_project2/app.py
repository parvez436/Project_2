from flask import Flask, render_template
from routes import routes
from db import init_db

app = Flask(__name__)
app.register_blueprint(routes)

# Initialize Database
init_db()

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/orders")
def orders_page():
    return render_template("table.html")

if __name__ == "__main__":
    app.run(debug=True)
