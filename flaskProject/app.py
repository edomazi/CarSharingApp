from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flask_jwt_extended import JWTManager

from calls.SingIn import SignIn
from calls.SignUp import SignUp
from calls.Profile import Profile
from calls.SearchTrips import SearchTrips
from calls.Dashboard import Dashboard
from calls.ValidateRegistrationToken import ValidateRegistrationToken
from calls.BookTrip import BookTrip
from calls.UpdateToDriver import UpdateToDriver
from calls.UpdateCarInfo import UpdateCarInfo
from calls.GetCarInfo import GetCarInfo
from calls.InsertNewTrip import InsertNewTrip
from calls.GetDriverInfo import GetDriverInfo
from calls.CancelBookedTrip import CancelBookedTrip
from calls.CancelTrip import CancelTrip
from calls.DashboardUserInfo import DashboardUserInfo
from calls.MarkAsDone import MarkAsDone
from calls.UpdateUserInfo import UpdateUserInfo
from calls.AddReview import AddReview
from calls.MakePayment import MakePayment

app = Flask(__name__, template_folder='frontend')
app.config['JWT_SECRET_KEY'] = 'Dizertatie_Car_Sharing_App_716854321'

api = Api(app)
CORS(app)

jwt = JWTManager(app)

api.add_resource(SignIn, '/signin')
api.add_resource(SignUp, '/signup')
api.add_resource(Profile, '/profile')
api.add_resource(SearchTrips, '/searchTrips')
api.add_resource(Dashboard, '/getDashboardTrips')
api.add_resource(ValidateRegistrationToken, '/validateToken')
api.add_resource(BookTrip, '/bookTrip')
api.add_resource(UpdateToDriver, '/updateToDriver')
api.add_resource(UpdateCarInfo, '/updateCarInfo')
api.add_resource(GetCarInfo, '/getCarInfo')
api.add_resource(InsertNewTrip, '/insertNewTrip')
api.add_resource(GetDriverInfo, '/getDriverInfo')
api.add_resource(CancelBookedTrip, '/cancelBooking')
api.add_resource(DashboardUserInfo, '/dashboardUserInfo')
api.add_resource(CancelTrip, '/cancelTrip')
api.add_resource(MarkAsDone, '/markAsDone')
api.add_resource(UpdateUserInfo, '/updateUserInfo')
api.add_resource(AddReview, '/addReview')
api.add_resource(MakePayment, '/makePayment')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
