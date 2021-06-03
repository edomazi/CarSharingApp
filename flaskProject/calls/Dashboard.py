from flask_restful import Resource
from flask import jsonify, request

from DatabaseStatements.DBQueries import SelectUserBookedTrips, SelectUserById, SelectDriverDoneTrips, \
    SelectAllUserBookedTrips
from utils.DBConnection import DBConnection
from flask_jwt_extended import jwt_required, get_jwt_identity


class Dashboard(Resource):
    @jwt_required
    def post(self):

        data_form = request.form

        trip_type = data_form.get('trip_type')
        identity_from_token = get_jwt_identity()

        try:
            if trip_type == 'booked':
                con = DBConnection()

                user_booked_trips = con.execute_query_params(SelectUserBookedTrips, (identity_from_token['id'],))
                t = []
                if len(user_booked_trips) > 0:
                    listOfIds = []
                    for trip in user_booked_trips:
                        listOfIds.append(trip[1])

                    con = DBConnection()
                    query = 'SELECT * FROM trips WHERE id IN (' + ','.join(map(str, listOfIds)) + ')'
                    trips = con.execute_query_params(query, ())

                    for trip in trips:
                        con = DBConnection()
                        driver = con.execute_query_params(SelectUserById, (trip[1],))
                        paid = con.execute_query_params("SELECT paid FROM booked_trips WHERE trip_id = %s AND user_id = %s", (trip[0], identity_from_token['id']))
                        parse_trip = dict({
                            "id": trip[0],
                            "driverName": driver[0][1] + " " + driver[0][2],
                            "driverId": driver[0][0],
                            "from": trip[2],
                            "to": trip[3],
                            "date": trip[4],
                            "price": trip[5],
                            "paid": paid[0][0],
                        })
                        t.append(parse_trip)

                con = DBConnection()
                query = 'SELECT * FROM trips WHERE driver_id = %s and done = 0'
                i_drive_trips = con.execute_query_params(query, (identity_from_token['id'],))
                driver_trips = []
                if len(i_drive_trips) > 0:
                    for drive in i_drive_trips:
                        temp = dict({
                            'id': drive[0],
                            'from': drive[2],
                            'to': drive[3],
                            'date': drive[4],
                            'seatsAvailable': drive[6],
                        })
                        driver_trips.append(temp)

                return jsonify(ok=1, trips=t, dirverTrips=driver_trips)

            else:
                con = DBConnection()
                user = con.execute_query_params(SelectUserById, (identity_from_token['id'],))
                trips = []
                if user[0][7] == 1:
                    user_driver_trips = con.execute_query_params(SelectDriverDoneTrips, (identity_from_token['id'],))
                    if len(user_driver_trips) > 0:
                        for trip in user_driver_trips:
                            trips.append({
                                'driver': True,
                                "from": trip[2],
                                "to": trip[3],
                                "date": trip[4],
                            })

                user_total_booked = con.execute_query_params(SelectAllUserBookedTrips, (identity_from_token['id'],))
                if len(user_total_booked) > 0:
                    listOfIds = []
                    for trip in user_total_booked:
                        listOfIds.append(trip[1])

                    con = DBConnection()
                    query = 'SELECT * FROM trips WHERE done = 1 AND id IN (' + ','.join(map(str, listOfIds)) + ')'
                    all_trips = con.execute_query_params(query, ())

                    for trip in all_trips:
                        con = DBConnection()
                        driver = con.execute_query_params(SelectUserById, (trip[1],))

                        parse_trip = dict({
                            "tripId": trip[0],
                            "driverId": driver[0][0],
                            "driver": False,
                            "driverName": driver[0][1] + " " + driver[0][2],
                            "from": trip[2],
                            "to": trip[3],
                            "date": trip[4],
                            "price": trip[5],
                        })
                        trips.append(parse_trip)

                return jsonify(ok=1, trips=trips)

        except:
            return jsonify(ok=0, message='Something went wrong')

    def get(self):
        return '', 404
