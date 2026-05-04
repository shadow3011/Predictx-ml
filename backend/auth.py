from flask import Blueprint, request, jsonify
from models import db, User
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
import re

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

def validate_signup_data(data):
    username = data.get('username', '')
    email = data.get('email', '')
    password = data.get('password', '')

    if len(username) < 3:
        return "Username must be at least 3 characters long."

    # Email regex
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if not re.match(email_regex, email):
        return "Invalid email format."

    # Password strength
    if len(password) < 8:
        return "Password must be at least 8 characters long."
    if not any(c.isupper() for c in password):
        return "Password must contain at least one uppercase letter."
    if not any(c.islower() for c in password):
        return "Password must contain at least one lowercase letter."
    if not any(c.isdigit() for c in password):
        return "Password must contain at least one number."
    if not any(not c.isalnum() for c in password):
        return "Password must contain at least one special character (e.g. !@#$%^&*)."

    return None

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    
    validation_error = validate_signup_data(data)
    if validation_error:
        return jsonify({"error": validation_error}), 400

    email = data['email'].lower()

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    user = User(
        username=data['username'],
        email=email,
        password=hashed_pw
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created"}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email', '').lower()
    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, data['password']):
        token = create_access_token(identity=str(user.id))
        return jsonify({"token": token})

    return jsonify({"error": "Invalid credentials"}), 401