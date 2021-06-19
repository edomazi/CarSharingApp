from flask_restful import Resource
from flask import request, jsonify

from utils.DBConnection import DBConnection
from DatabaseStatements.DBQueries import SearchForTrips, GetDriverName


class SearchTrips(Resource):
    def post(self):
        data_form = request.form

        from_where = data_form.get('from')
        to_where = data_form.get('to')
        dateToday = data_form.get('dateToday')

        try:
            con = DBConnection()
            total_trips = con.execute_query_params(SearchForTrips, (from_where, to_where, dateToday, int(dateToday) + 86400000))

            if len(total_trips) > 0:
                trips = []
                for trip in total_trips:
                    driver_info = con.execute_query_params(GetDriverName, (str(trip[1]), ))

                    parse_trip = dict({
                        "id": trip[0],
                        "driver_id": trip[1],
                        "from": trip[2],
                        "to": trip[3],
                        "date": trip[4],
                        "price": trip[5],
                        "seats": trip[6],
                        "description": trip[7],
                        "driverFirstName": driver_info[0][0],
                        "driverLastName": driver_info[0][1],
                    })
                    trips.append(parse_trip)

                return jsonify(ok=1, trips=trips)
            else:
                return jsonify(ok=1, trips=[])

        except:
            return jsonify(ok=0, message='Something bad happened')


    def get(self):
        return '', 404
