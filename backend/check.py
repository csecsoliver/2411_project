compatible_1 = {
    "d4": ["d4"],
    "d2": ["d2"],
    "n1": ["n1"],
    "n2": ["n2"],
    "n3": ["n3"],
    "n4": ["n4"],
    "n5": ["n5"],
    "n6": ["n6"],
    "n7": ["n7"],
    "n8": ["n8"],
    "n9": ["n9"],
    "n0": ["n0"],
    "s0": ["s0"],
    "k0": ["k0"],
    "c0": ["c0"], 
}
compatible_3 = {
    "n":["n","b","r","g","y"],
    "b":["n","b"],
    "r":["n","r"],
    "g":["n","g"],
    "y":["n","y"],
    
}
def check_move(throw_pool, move):
    print("throw pool:", throw_pool)
    print("checking move:",move)
    if move[2] in compatible_3[throw_pool[2]]:
        print("color check ok")
        return True
    elif move[0]+move[1] in compatible_1[throw_pool[0]+throw_pool[1]]:
        print("function check ok")
        return True
    else:
        print("move not compatible: ", move[2], compatible_3[throw_pool[2]], "/", move[0]+move[1], compatible_1[throw_pool[0]+throw_pool[1]])
        
        return False