from bottle import route, run, get, post, request, template
import time
import ai
import check
import multiplayer

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
    if session_id in sessions:
        sessions[session_id].players[player_num] = []
        sessions[session_id].player_nums.append(player_num)
        return "Successfully joined"

@post('/get_state/<session_id>')
def get_state(session_id):
    
    return sessions[session_id].players, sessions[session_id].throw_pool, sessions[session_id].chosen_color
    
@get('/submit/<pool>/<throw_pool>/<move>/<hand>/<reverse>/<carryOverPull>/<session_id>/<player_id>')
def move():
    return None
    
@get('/aimove/<session_id>/<hand>/<throw_pool>/<chosen_color>')
def aimove(session_id, hand, throw_pool, chosen_color):
    retries = 0
    while True:
        move, chosen_color = ai.get_move(session_id, hand, throw_pool, chosen_color)
        viablility = check.check_move(throw_pool, move)
        if viablility == True and move[2] == chosen_color:
            break
        else:
            retries += 1
            if retries == 2:
                move = "draw"
                break
            continue
    return move
    
if __name__ == '__main__':
    # card naming scheme {function}{function_num/card_num}{card_color}
    # d4n: draw 4 grey
    # d2b: draw 2 blue
    # n2g: none 2 green
    # functions: n=NoNe, d=Draw, c=Choose Color, s=Switch direction, k=sKip player
    # numbers: 1,2,3,4,5,6,7,8,9,0
    # colors: b=blue, r=red, y=yellow, g=green, n=gray/none
    sessions = {}
    run(host='0.0.0.0', port=8080, debug=True)