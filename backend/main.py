from bottle import *
import ai as aii
import check
import multiplayer

from bottle_cors_plugin import cors_plugin

@route('/static/<filename>')
def server_static(filename):
    return static_file(filename, root='../frontend/')
@route('/static/img/<filename>')
def server_static_img(filename):
    return static_file(filename, root='../frontend/img/')
@route('/static/img/cards/<filename>')
def server_static_img_cards(filename):
    return static_file(filename, root='../frontend/img/cards/')


@get('/ai/<session_id>')
def ai(session_id):
    if session_id != token:
        time.sleep(1)
        return "Invalid session ID"

@get('/join/<session_id>/<name>')
def join(session_id, name):
    
    if session_id in sessions:
        if len(sessions[session_id].players) < 4:
            sessions[session_id].players[name] = []
            return "joined"

@get('/get_state/<session_id>')
def get_state(session_id):
    
    return sessions[session_id].players, sessions[session_id].throw_pool, sessions[session_id].chosen_color
    
@get('/submit/<session_id>/<player_id>/<throw_pool>/<move>/<hand>/<reverse>/<carryOverPull>')
def submit(session_id, player_id, throw_pool, move, hand, reverse, carryOverPull):
    return "submitted"
    
@get('/aimove/<session_id>/<hand>/<throw_pool>/<chosen_color>')
def aimove(session_id, hand, throw_pool, chosen_color):
    retries = 0
    if session_id != token:
        time.sleep(10)
        return "Invalid session ID"
    while True:
        hand_temp = hand.split(",")
        move= aii.get_move(session_id, hand_temp, throw_pool, chosen_color)
        if chosen_color in ["r","g","y","b"]:
            viablility = check.check_move(throw_pool[0]+throw_pool[1]+chosen_color, move)
        else:
            viablility = check.check_move(throw_pool, move)
        if move == "draw":
            print("draw detected")
            return f"{move} {chosen_color}"
        elif viablility == True or move[2] == chosen_color:
            print("corect move")
            return f"{move} {chosen_color}"
        else:
            retries += 1
            if retries == 1:
                move = "draw"
                print("draw forced")
                break
            continue
    return f"{move} {chosen_color}"

@get('/snarky/<session_id>')
def snarky(session_id):
    
    if session_id != token:
        time.sleep(10)
        return "Invalid session ID"
    response = aii.snarky_response()
    return response

app = app()
app.install(cors_plugin('*'))
if __name__ == '__main__':
    # card naming scheme {function}{function_num/card_num}{card_color}
    # d4n: draw 4 grey
    # d2b: draw 2 blue
    # n2g: none 2 green
    # functions: n=NoNe, d=Draw, c=Choose Color, s=Switch direction, k=sKip player
    # numbers: 1,2,3,4,5,6,7,8,9,0
    # colors: b=blue, r=red, y=yellow, g=green, n=gray/none
    sessions = {}
    token = "verysecureid"
    run(host='0.0.0.0', port=8080, debug=True)