from flask import Flask, request, make_response, jsonify, session
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from models import db, User, Book, CheckoutLog
import random
from datetime import datetime, timedelta
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
app.secret_key = b"\x7f\x7f(\xe8\x0c('\xa8\xa5\x82pb\t\x1d>rZ\x8c^\x7f\xbb\xe2L|"
app.config['JWT_SECRET_KEY'] = '2b5faaf05ca77b1e23aa9f3e1c05d840'

CORS(app, supports_credentials=True, origins=["http://localhost:3000", "https://flatiron-myberry-client.onrender.com"])
migrate = Migrate(app, db)

db.init_app(app)
api = Api(app)
jwt = JWTManager(app)


@app.route('/')
def index():
    return '<h1>myBerry API is running!</h1>'


@app.route('/users', methods=['GET'])
def get_users():
    users = []
    for user in User.query.all():
        user_dict = {
            "id": user.id,
            "fname": user.fname,
            "lname": user.lname,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "created_at": user.created_at
        }
        users.append(user_dict)

    response = make_response(
        users,
        200,
        {"Content-Type": "application/json"}
    )
    return response


class Users(Resource):
    def post(self):
        data = request.get_json()
        try:
            user = User(
                fname=data["fname"],
                lname=data["lname"],
                email=data["email"],
                phone=data["phone"],
                role="user",
                password=data["password"],
            )
            db.session.add(user)
            db.session.commit()
        except Exception as errors:
            return make_response({
                "errors": [errors.__str__()]
            }, 422)
        return make_response(user.to_dict(), 201)
api.add_resource(Users, '/users')


class UserById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        user_dict = user.to_dict(rules=('books', 'books.checkout_logs.id',))
        response = make_response(
            user_dict,
            200,
            {"Content-Type": "application/json"}
        )
        return response

    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({'error': 'user not found'}, 404)
        db.session.delete(user)
        db.session.commit()
        response = make_response('', 200)
        return response
api.add_resource(UserById, '/users/<int:id>')


@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    user.fname = request.json.get("fname")
    user.lname = request.json.get("lname")
    user.email = request.json.get("email")
    user.phone = request.json.get("phone")
    db.session.commit()
    user_dict = {
        "id": user.id,
        "fname": user.fname,
        "lname": user.lname,
        "email": user.email,
        "phone": user.phone
    }
    response = make_response(
        user_dict,
        200,
        {"Content-Type": "application/json"}
    )
    return response


class Books(Resource):
    def get(self):
        books = []
        for book in Book.query.all():
            log = CheckoutLog.query.filter_by(book_id=book.id).first()
            if log:
                x = True
                checkout_id = log.id
                user = log.user_id
            else:
                x = False
                checkout_id = None
                user = None

            book_dict = {
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "genre": book.genre,
                "year": book.year,
                "image": book.image,
                "description": book.description,
                "checkout_log": x,
                "checkout_id": checkout_id,
                "user_id": user
            }
            books.append(book_dict)

        response = make_response(
            books,
            200,
            {"Content-Type": "application/json"}
        )
        return response
api.add_resource(Books, '/books')


class CreateLogs(Resource):
    def post(self):
        data = request.get_json()
        try:
            new_log = CheckoutLog(
                user_id=data['user_id'],
                book_id=data['book_id'],
                due_date= datetime.fromtimestamp(data['due_date'])
            )
            db.session.add(new_log)
            db.session.commit()
        except Exception as errors:
            return make_response({
                "errors": [errors.__str__()]
            }, 422)
        new_log_dict = new_log.to_dict()
        print(new_log_dict)
        return make_response(new_log_dict, 201)
api.add_resource(CreateLogs, '/create_logs')


class CreateLogsById(Resource):
    def delete(self, id):
        log = CheckoutLog.query.filter_by(id=id).first()
        if not log:
            return make_response({'error': 'books not found'}, 404)
        db.session.delete(log)
        db.session.commit()
        return make_response('', 200)
api.add_resource(CreateLogsById, '/create_logs/<int:id>')

class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data['email']
        password = data['password']
        user = User.query.filter_by(email=email).first()
        if not user or (not (user.password == password)):
            return make_response(
                {"error": "Invalid email or password"},
                401,
                {"Content-Type": "application/json"}
            )
        token = create_access_token(identity=user.id)
        response = make_response(
         {"token": token},
            200,
            {"Content-Type": "application/json"}
        )
        # Set the cookie with an expiration time of 24 hours
        expires = datetime.now() + timedelta(days=1)
        response.set_cookie("token", token, expires=expires)
        return response
    
api.add_resource(Login, '/login')


class Logout(Resource):
    def delete(self):
        print(f'{session}-before delete ')
        session['user_id'] = None
        # session.clear()
        # session.pop('user_id', None)
        
        print(f'{session}-after delete ')
        return {'message': '204: No Content'}, 204
api.add_resource(Logout, '/logout')


class CheckSession(Resource):
    def get(self):
        print(session)
        user = User.query.filter(User.id == session.get('user_id')).first()
        print(session)
        if user:
            return user.to_dict()
        else:
            return {'message': '401: Not Authorized'}, 401


api.add_resource(CheckSession, '/check_session')

@app.route('/get-user-data', methods=['GET'])
@jwt_required()
def get_user_data():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user:
        user_dict = {
            "id": user.id,
            "fname": user.fname,
            "lname": user.lname,
            "email": user.email,
            "phone": user.phone,
        }
        response = make_response(
            user_dict,
            200,
            {"Content-Type": "application/json"}
        )
    else:
        response = make_response(
            {"error": "User not found"},
            404,
            {"Content-Type": "application/json"}
        )

    return response

if __name__ == '__main__':
    app.run(port=5555)
