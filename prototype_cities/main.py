from player import *

# Fix python 2.x
try: input = raw_input
except NameError: pass

N_CITIES = 2
VOLUNTEERS_WIN = 500

def lose(p):
    return any([health <= 0 for health in p.cityHealth()])

def win(p):
    return p.countVolunteers() >= VOLUNTEERS_WIN

p = Player()
[p.addCity() for _ in range(N_CITIES)]

print(
    "\nMechanics of the game:\n" + \
    "Your objective is to have enough volunteers in all your cities -- you want to have 500 volunteers overall.\n" + \
    "You gain volunteers when you have permanent preparedness in your cities.\n" + \
    "Your preparedness also protects your city from disaster damage.\n"
)

while (not lose(p)) and (not win(p)):
    p.generateDisasters()
    forecast = p.forecast()
    print("Forecast for this round:\n%s\n" % forecast)
    input("PRESS ENTER TO CONTINUE\n")
    option = -1
    while option != "g":
        print(
            "Gold: %d\n" % (p.gold) + \
            "Possible actions:\n" + \
            "a) View state of your cities\n" + \
            ("b) Add permanent preparedness (decreases damage from disasters) -- 10% preparedness for 100 gold\n" if p.gold >= 100 else "") + \
            ("c) Add short term preparedness (cheaper, but only decreases damage for one round) -- 50% short term preparedness for 20 gold\n" if p.gold >= 20 else "") + \
            ("d) Heal one of your cities -- 10% health for 50 gold\n" if p.gold >= 50 else "") + \
            ("e) Upgrade forecasting (decreases the period at which you get forecasts) -- 50 gold for each upgrade, decreasing period by 1\n" if p.gold >= 50 else "") + \
            "f) Display the forecast\n" + \
            "g) Indicate you are ready to move to the next turn"
        )

        option = -1
        while option not in ["a","b","c","d","e","f","g"]:
            option = input("Write a/b/c/d/e/f/g to select an action: ")
        print("You have selected option %s" % option)
        if option == "a":
            print(str(p))
        elif option == "b":
            city = -1
            while city not in [1,2]:
                try:
                    city = int(input("Which city do you want to add preparedness to (write 1 or 2): "))
                except:
                    pass
            print(p.addPreparedness(city))
        elif option == "c":
            city = -1
            while city not in [1,2]:
                try:
                    city = int(input("Which city do you want to add short term preparedness to (write 1 or 2): "))
                except:
                    pass
            print(p.addShortTerm(city))
        elif option == "d":
            city = -1
            while city not in [1,2]:
                try:
                    city = int(input("Which city do you want to heal (write 1 or 2): "))
                except:
                    pass
            print(p.disasterRecovery(city))
        elif option == "e":
            print(p.upgradeForecasting())
        elif option == "f":
            print("Forecast for this round:\n%s\n" % forecast)

        input("PRESS ENTER TO CONTINUE\n")
    print(p.turn())
    input("PRESS ENTER TO CONTINUE\n")

if lose(p):
    print("One of your cities's health went to 0, or below, so you lose.\n%s" % str(p))
elif win(p):
    print("You have over %d volunteers in your cities, so you win!\n%s" % (VOLUNTEERS_WIN,str(p)))
else:
    assert False, "What is going on here?"