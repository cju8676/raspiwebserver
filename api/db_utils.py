import psycopg2
import yaml
import os

from datetime import date

# Establish a connection to our database
def connect():
    config = {}
    yml_path = os.path.join(os.path.dirname(__file__), 'db.yml')
    with open(yml_path, 'r') as file:
        config = yaml.load(file, Loader=yaml.FullLoader)
    
    return psycopg2.connect(dbname=config['database'],
                            user=config['user'],
                            password=config['password'],
                            host=config['host'],
                            port=config['port'])

# Returns the first entry from the query
def exec_get_one(sql, args={}):
    conn = connect();
    cur = conn.cursor();
    cur.execute(sql, args)
    one = cur.fetchone()
    conn.close()
    return one

def exec_get_all(sql, args={}):
    conn = connect()
    cur = conn.cursor()
    cur.execute(sql, args)
    list_of_tuples = cur.fetchall()
    conn.close()
    return tuples_to_lists(list_of_tuples)

def tuples_to_lists(list_of_tuples):
    list_of_lists = []
    for one_tuple in list_of_tuples:
        tuple_as_list = turn_to_strings(list(one_tuple))
        list_of_lists.append(tuple_as_list)
    return list_of_lists


def turn_to_strings(data_list):
    new_list = []
    for element in data_list:
        if isinstance(element, date):
            new_list.append(element.strftime("%Y/%m/%d"))
        else:
            new_list.append(str(element))
    return new_list