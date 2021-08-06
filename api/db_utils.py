import psycopg2
import yaml
import os

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