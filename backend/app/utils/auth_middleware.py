from functools import wraps
from flask import request, jsonify, current_app
import jwt
from datetime import datetime, timedelta
from app.models import User, db

def generate_token(user_id, expires_in_days=7):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=expires_in_days),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]
            elif len(parts) == 1:
                token = parts[0]
                
        if not token:
            return jsonify({'success': False, 'message': 'Authentication token is missing'}), 401
            
        try:
            payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            current_user = db.session.get(User, payload['user_id'])
            if not current_user:
                return jsonify({'success': False, 'message': 'User not found or deactivated'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'success': False, 'message': 'Token has expired. Please log in again.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'success': False, 'message': 'Invalid token. Authentication failed.'}), 401
        except Exception as e:
            return jsonify({'success': False, 'message': f'Auth error: {str(e)}'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

def optional_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        current_user = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            parts = auth_header.split()
            token = parts[1] if len(parts) == 2 and parts[0].lower() == 'bearer' else parts[0]
            try:
                payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
                current_user = db.session.get(User, payload.get('user_id'))
            except Exception:
                current_user = None
                
        return f(current_user, *args, **kwargs)
    return decorated
