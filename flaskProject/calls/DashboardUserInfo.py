from flask_restful import Resource
from flask import jsonify

from DatabaseStatements.DBQueries import SelectUserBookedTrips, SelectUserById, SelectAllUserBookedTrips, SelectDriverTrips
from utils.DBConnection import DBConnection
from flask_jwt_extended import jwt_required, get_jwt_identity


class DashboardUserInfo(Resource):
    @jwt_required
    def post(self):

        identity_from_token = get_jwt_identity()
        try:
            con = DBConnection()
            user = con.execute_query_params(SelectUserById, (identity_from_token['id'],))
            parse_user = dict({
                "id": user[0][0],
                "firstName": user[0][1],
                "lastName": user[0][2],
                "isDriver": user[0][7],
                "city": user[0][8],
                "country": user[0][9],
            })

            user_driver_trips = con.execute_query_params('SELECT * from trips WHERE driver_id = %s and done = 1', (identity_from_token['id'],))

            user_booked_trips = con.execute_query_params(SelectUserBookedTrips, (identity_from_token['id'],))

            user_driver_undone_trips = con.execute_query_params('SELECT * from trips WHERE driver_id = %s and done = 0', (identity_from_token['id'],))

            user_total_booked = con.execute_query_params(SelectAllUserBookedTrips, (identity_from_token['id'],))

            total_trips = len(user_total_booked) + len(user_driver_trips)
            incoming_trips = len(user_driver_undone_trips) + len(user_booked_trips)

            return jsonify(ok=1, user=parse_user, booked_trips=incoming_trips, total_trips=total_trips)

        except:
            return jsonify(ok=0, message='Something went wrong')

    def get(self):
        return '', 404
