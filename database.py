import pymysql
from dotenv import dotenv_values

env = dotenv_values('.env')

def consultar(instrucao, argumentos=[]):
    with pymysql.connect(
        host=env['DB_HOST'],
        user=env['DB_USER'],
        password=env['DB_PWD'],
        database=env['DB_DATABASE'],
        port=int(env['DB_PORT']),
        cursorclass=pymysql.cursors.DictCursor) as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(instrucao, argumentos)
            resultado = cursor.fetchall()
            conexao.commit()
            return resultado
        