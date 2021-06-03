from flask_restful import Resource
from flask import jsonify, request

from DatabaseStatements.DBQueries import SelectUserById, SelectCarInfos, SelectUserStars, SelectDriverReviews
from utils.DBConnection import DBConnection


class GetDriverInfo(Resource):
    def post(self):

        data_form = request.form

        driver_id = data_form.get('driverId')

        try:
            con = DBConnection()
            user = con.execute_query_params(SelectUserById, (driver_id,))

            car = con.execute_query_params(SelectCarInfos, (driver_id,))

            rating = con.execute_query_params(SelectUserStars, (driver_id,))

            reviews = con.execute_query_params(SelectDriverReviews, (driver_id,))

            total_stars = 0
            if len(rating):
                for star in rating:
                    total_stars += star[0]

            reviews_array = []
            if len(reviews):
                for review in reviews:
                    reviews_array.append(review)

            stars = 0
            if len(rating) != 0:
                stars = total_stars / len(rating)

            parse_drive = dict({
                "firstName": user[0][1],
                "lastName": user[0][2],
                "fullName": user[0][1] + " " + user[0][2],
                "email": user[0][3],
                "carManufacturer": car[0][2],
                "carModel": car[0][3],
                "carColor": car[0][4],
                "carSize": car[0][5],
                "stars": stars,
                "reviews": reviews_array,
            })

            return jsonify(ok=1, driverInfos=parse_drive)

        except:
            return jsonify(ok=0, message='Something wrong happened')

    def get(self):
        return '', 404
