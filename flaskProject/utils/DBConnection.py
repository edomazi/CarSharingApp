import mysql.connector


class DBConnection():
    connection = None

    def __init__(self):
        self.connection = mysql.connector.connect(user="root",
                                                  password="",
                                                  host="127.0.0.1",
                                                  database='dizertatie')

    def execute_query(self, a_query):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(a_query)
        results = cursor.fetchall()
        cursor.close()
        return results

    def execute_query_params(self, a_query, a_tuple):
        cursor = self.connection.cursor(prepared=True)
        cursor.execute(a_query, a_tuple)
        results = cursor.fetchall()
        cursor.close()
        return results

    def execute_insert_query(self, a_query, a_tuple):
        cursor = self.connection.cursor(prepared=True)
        result = cursor.execute(a_query, a_tuple)
        self.connection.commit()
        id = cursor.lastrowid
        cursor.close()
        return id
