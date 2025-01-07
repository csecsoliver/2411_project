from openai import OpenAI
client = OpenAI()

def get_move(session_id, hand, throw_pool, chosen_color):
    hand_str = ""
    for i in hand:
        hand_str += i
        hand_str += ", "
    if chosen_color != "n":
        throw_pool = throw_pool[0] + throw_pool[1] + chosen_color
    completion = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        # {"role": "developer", "content": "Your are a helful and smart assistant."},
        {"role": "user", "content": """You are an uno player. You will get the cards present in your hands and the throwing pool. The next message will contain all the information you will need to answer.

    The cards' labels are formulated as follows:
    the first two letters will assign a type to the card (d4, d2, n1, n2, n3, n4 ,n5, n6, n7, n8, n9, n0, s0, k0, c0)
    The third letter will assign a color to the card (b, r, y, g, n)

    You can choose a card from your hand, or draw one from the stack.

    How to check if you can place a card:
    1. Check the third letter: "b", "r", "y", "g" can be either placed on a matching card or an "n" card and an "n" card can be placed on any card
    2. If that wouldn't work, check the first two letters, they can be placed on a card with a matching type

    Your response should only contain the move you have chosen, no extra text, capitalization or punctuation needed.
    Only if your move is c0n or d4n, also place a letter indicating the chosen color separated by a space.
    if the card in your hand doesn’t match either by color or type with the card in the throwing pool, you should draw instead of making an incorrect move."""},
        {"role": "user", "content": f"Hand: \"{hand_str}\" \nThrowing pool: \"{throw_pool}\""}
    ]
    )
    print(f"Hand: \"{hand_str}\" \nThrowing pool: \"{throw_pool}\"")
    print("ai chose:", completion.choices[0].message.content)
    return completion.choices[0].message.content



# print(get_move("123", ["c0n"], "d2b", None))
# print(client.models.list())
def snarky_response():
    completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "You are a player who will make the next move in a game of uno. The next message should contain a snarky response to the others from you. Don't use quotes. Don't asssume any previous context. Don't use any punctuation. Don't use any capitalization. Use emojis."}
    ],
    temperature=1.26,
    max_completion_tokens=250,
    top_p=1,
    frequency_penalty=0,
    presence_penalty=0
    )
    return completion.choices[0].message.content