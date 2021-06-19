from flask_restful import Resource
from flask import jsonify

from DatabaseStatements.DBQueries import SelectUserById, SelectUserStars, SelectDriverReviews
from utils.DBConnection import DBConnection
from flask_jwt_extended import jwt_required, get_jwt_identity

class Profile(Resource):
    @jwt_required
    def post(self):
        con = DBConnection()

        try:
            identity_from_token = get_jwt_identity()
            user = con.execute_query_params(SelectUserById, (identity_from_token['id'],))
            rating = con.execute_query_params(SelectUserStars, (identity_from_token['id'],))
            review = con.execute_query_params(SelectDriverReviews, (identity_from_token['id'],))

            total_stars = 0
            stars = 0
            if len(rating):
                for star in rating:
                    total_stars += star[0]
                stars = total_stars / len(rating)

            all_reviews = []
            if len(review):
                for item in review:
                    temp = dict({
                        "review": item[0],
                        "review_by": item[1] + " " + item[2],
                    })
                    all_reviews.append(temp)


            parse_user = dict({
                "id": user[0][0],
                "firstName": user[0][1],
                "lastName": user[0][2],
                "fullName": user[0][1] + " " + user[0][2],
                "email": user[0][3],
                "isDriver": user[0][7],
                "city": user[0][8],
                "country": user[0][9],
                "phoneNumber": user[0][10],
                "age": user[0][11],
                "driverLicenseNumber": user[0][12],
                "stars": stars,
                "reviews": all_reviews,
            })

            return jsonify(ok=1, user=parse_user)

        except:
            return jsonify(ok=0, message='Something went wrong')

    def get(self):
        return '', 404
