InsertNewUsers = 'INSERT INTO users (first_name, last_name, email, password, activated, activation_token) VALUES (%s, %s, %s, %s, %s, %s)'

SelectUserByEmail = 'SELECT * FROM users WHERE email = %s'

SelectUserById = 'SELECT * from users WHERE id = %s'

SelectUserByActivationToken = 'SELECT * from users WHERE activation_token = %s'

SetUserToActivated = 'UPDATE users SET activated = 1 WHERE id = %s'

# TODO eventually add feature to add alert and send mail if a seats becomes available
SearchForTrips = 'SELECT * from trips where `from` = %s AND `to` = %s AND date > %s AND date < %s AND available_seats > 0 ORDER BY DATE asc'

CreateDatabaseForUser = 'CREATE DATABASE `user_%s`'

CreateTableBookedTrips = '''CREATE TABLE `booked_trips` (
                            `id` INT NULL AUTO_INCREMENT,
                            `trip_id` INT NULL DEFAULT '0',
                            `paid` FLOAT NULL DEFAULT '0',
                            `seats_booked` INT NULL DEFAULT '0',
                            INDEX `id` (`id`)
                        )
                        COLLATE='utf8mb4_0900_ai_ci'
                        ;'''

CreateTableCars = '''CREATE TABLE `cars` (
                    `id` INT NULL AUTO_INCREMENT,
                    `manufacturer` VARCHAR(50) NULL DEFAULT NULL,
                    `model` VARCHAR(50) NULL DEFAULT NULL,
                    `color` VARCHAR(50) NULL DEFAULT NULL,
                    `size` VARCHAR(50) NULL DEFAULT NULL,
                    INDEX `id` (`id`)
                )
                COLLATE='utf8mb4_0900_ai_ci'
                ;'''

SelectUserBookedTrips = 'SELECT * FROM booked_trips WHERE user_id = %s and done = 0'

SelectAllUserBookedTrips = 'SELECT * FROM booked_trips where user_id = %s and done = 1'

UpdateNumberOfSeats = 'UPDATE trips SET available_seats = available_seats - %s WHERE id = %s'

InsertBookedTripToUser = 'INSERT INTO booked_trips (trip_id, user_id, price, seats_booked, done, paid) values (%s, %s, %s, %s, %s, %s)'

UpdateUserToDriver = 'UPDATE users SET driver = 1 WHERE id = %s'

UpdateCarInfos = 'UPDATE cars SET manufacturer = %s, model = %s, color = %s, size = %s  WHERE id = %s'

InsertNewCar = 'INSERT INTO cars (user_id, manufacturer, model, color, cars.size) VALUES  (%s, %s, %s, %s, %s)'

GetDriverName = 'SELECT first_name, last_name FROM users where id = %s'

InsertTrip = 'INSERT INTO trips (driver_id, trips.from, trips.to, trips.date, price, available_seats, description, done) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)'

SelectCarInfos = 'SELECT * FROM cars WHERE user_id = %s'

SelectSeatsNumber = 'SELECT seats_booked FROM booked_trips WHERE user_id = %s AND trip_id = %s'

DeleteUserBookedTrip = 'DELETE FROM booked_trips where user_id = %s AND trip_id = %s'

SelectDriverTrips = 'SELECT * from trips WHERE driver_id = %s and done = 0'

SelectDriverDoneTrips = 'SELECT * from trips WHERE driver_id = %s and done = 1'

DeleteTrip = 'DELETE FROM trips WHERE id = %s'

DeleteBookedTripWhenDeleteTrip = 'DELETE FROM booked_trips where trip_id = %s'

SelectUsersFromCanceledTrip = 'SELECT email FROM users INNER JOIN booked_trips ON users.id = booked_trips.user_id WHERE booked_trips.trip_id = %s'

MarkBookedTripAsDone = 'UPDATE booked_trips SET done = 1 WHERE trip_id = %s'

MarkTripAsDone = 'UPDATE trips SET done = 1 WHERE id = %s'

UpdateUserInfos = 'UPDATE users SET first_name = %s,' \
                  ' last_name = %s,' \
                  ' city = %s,' \
                  ' country = %s,' \
                  ' phone_number = %s,' \
                  ' age = %s,' \
                  ' driver_license_number= %s' \
                  ' WHERE id = %s'

InsertReview = 'INSERT INTO trips_reviews (driver_id, review_by, trip_id, review, rating) VALUES (%s, %s, %s, %s, %s)'

SelectUserStars = 'SELECT rating from trips_reviews WHERE driver_id = %s'

SelectDriverReviews = 'SELECT trips_reviews.review, users.first_name, users.last_name from trips_reviews INNER JOIN ' \
                      'users ON trips_reviews.review_by = users.id WHERE driver_id = %s'

SelectDriverReviewsStarsAndUser = 'SELECT trips_reviews.rating, trips_reviews.review, users.first_name, users.last_name ' \
                                  'FROM trips_reviews INNER JOIN users ON trips_reviews.review_by = users.id ' \
                                  'WHERE trips_reviews.driver_id = %s'

DoPayment = 'UPDATE booked_trips SET paid = 1 WHERE trip_id = %s AND user_id = %s'

SelectAllUsers = 'SELECT * FROM users'
