from flask import Blueprint, request, jsonify
from app.models import db, User
from app.utils.auth_middleware import generate_token, token_required
import re

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    headline = data.get('headline', '').strip()

    if not name:
        return jsonify({'success': False, 'message': 'Full name is required'}), 400
    if not email or not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'success': False, 'message': 'A valid email address is required'}), 400
    if not password or len(password) < 6:
        return jsonify({'success': False, 'message': 'Password must be at least 6 characters long'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'success': False, 'message': 'An account with this email already exists'}), 409

    try:
        new_user = User(
            name=name,
            email=email,
            headline=headline or 'Aspiring Professional'
        )
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        token = generate_token(new_user.id)
        return jsonify({
            'success': True,
            'message': 'Account created successfully!',
            'token': token,
            'user': new_user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Registration failed: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

    token = generate_token(user.id)
    return jsonify({
        'success': True,
        'message': 'Login successful!',
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({
        'success': True,
        'user': current_user.to_dict()
    }), 200

@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout(current_user):
    return jsonify({
        'success': True,
        'message': 'Logged out successfully'
    }), 200

@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json() or {}
    if 'name' in data and data['name'].strip():
        current_user.name = data['name'].strip()
    if 'headline' in data:
        current_user.headline = data['headline'].strip()
    
    try:
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'user': current_user.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Update failed: {str(e)}'}), 500
