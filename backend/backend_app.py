from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///wellness.db'
db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)

class Checkin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    mood = db.Column(db.String(50))
    stress_level = db.Column(db.Integer)
    notes = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class Resource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150))
    link = db.Column(db.String(255))

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 409
    user = User(username=data['username'], email=data['email'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'id': user.id, 'username': user.username})

@app.route('/api/checkin', methods=['POST'])
def checkin():
    data = request.json
    user = User.query.get(data['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    checkin = Checkin(user_id=user.id, mood=data['mood'],
                      stress_level=data['stress_level'], notes=data.get('notes', ''))
    db.session.add(checkin)
    db.session.commit()
    return jsonify({'id': checkin.id, 'timestamp': checkin.timestamp})

@app.route('/api/checkins/<int:user_id>', methods=['GET'])
def get_checkins(user_id):
    checkins = Checkin.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': c.id, 'mood': c.mood, 'stress_level': c.stress_level,
        'notes': c.notes, 'timestamp': c.timestamp.strftime('%Y-%m-%d %H:%M')
    } for c in checkins])

@app.route('/api/resources', methods=['GET'])
def resources():
    resources = Resource.query.all()
    return jsonify([{'id': r.id, 'title': r.title, 'link': r.link} for r in resources])

# Utility to initialize the database with some resources
@app.cli.command('initdb')
def initdb_command():
    db.create_all()
    res1 = Resource(title='College Counseling Services', link='https://counseling.college.edu')
    res2 = Resource(title='Mental Health Helpline', link='tel:+1800123456')
    db.session.add_all([res1, res2])
    db.session.commit()
    print("Database initialized and filled with resources.")

if __name__ == "__main__":
    app.run(debug=True)