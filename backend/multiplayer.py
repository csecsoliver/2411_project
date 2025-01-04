import check
class Session:
    
    def __init__(self, session_id,players, player_nums, throw_pool, pool):
        
        self.session_id = session_id # player chosen session_id
        self.players = players # dict with player_id as key and list of cards as value
        self.player_nums = player_nums # ordered list of player_ids
        self.throw_pool = throw_pool
        self.pool = pool # number of cards in the pool
        self.chosen_color = ""
        print(self.session_id, self.players, self.throw_pool, self.pool, sep=", ")
        
    def move(self, player_id, move):
        # approve move, and send back dict with the player hands, throw_pool, chosen_color
        if move[0] == "draw":
            self.pool -= 1
            self.players[player_id].append(move[1])
            return [self.players, self.throw_pool, self.chosen_color]
        elif check.check_move(move[0]):
            self.players[player_id].remove(move[0])
            self.throw_pool = move[0]
            return [self.players, self.throw_pool, move[1]]
        else:
            print("bajvan")
            return False
    
        
                
                
            
        
        