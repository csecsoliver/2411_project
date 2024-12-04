from bottle import route, run, get, post, request, template
import time


@route('/getform')
def hello():
    return "Hello World!"

@post('/ai') # or @route('/login', method='POST')
def request_ai():
    username = request.forms.username
    token = request.forms.token
    

@post('/multiplayer/') # or @route('/login', method='POST')
def join():
    player_num = request.forms.player_num
    session_id = request.forms.session_id
    if session_id not in sessions:
        if player_num != "1":
            return "creatingOnlyAllowedAsPlayer1"
        sessions[session_id] = session_template.copy()

@get('/submit/<pool>/<throw_pool>/<move>')
def move(pool, throw_pool, move):
    return None
    
    
if __name__ == '__main__':
    # card naming scheme {function}{function_num/card_num}{card_color}
    # d4n: draw 4 grey
    # d2b: draw 2 blue
    # n2g: none 2 green
    # functions: n=none, d=draw, c=choose color, s=switch direction, k=skip player
    # numbers: 1,2,3,4,5,6,7,8,9,0
    # colors: b=blue, r=red, y=yellow, g=green, n=gray/none
    session_template = {"player1":[],"player2":[],"player3":[],"player4":[], "pool":"", "throw_pool": "", "connected": []}
    sessions = {"test": {"player1":["n2r","d4n"],"player2":["n2b","d4n"],"player3":["n2b","d4n"],"player4":["n2y","d4n"], "pool":"11", "throw_pool": "d2r", "connected": ["1","2"]}}
    run(host='0.0.0.0', port=8080, debug=True)