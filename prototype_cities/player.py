from cities import *
from disasters import *

class Player:
    PREPAREDNESS_COST = 10.
    PREPARE_AMOUNT = 10

    SHORT_TERM_COST = 20./50.
    SHORT_TERM_AMOUNT = 50

    HEALTH_COST = 5.
    HEALTH_AMOUNT = 10

    UPGRADE_COST = 50.

    def __init__(self, initial_gold = 100):
        self.gold = initial_gold
        self.cities = []
        self.disasterGenerator = Disasters()

    def addCity(self):
        city = City()
        self.cities.append(city)
        self.disasterGenerator.addCity(city)

    def __repr__(self):
        res = "Gold: %d\n\n" % self.gold
        for i,c in enumerate(self.cities):
            res += "*** City #%d ***\n%s\n" % (i+1,str(c))
        return res

    def __str__(self):
        return self.__repr__()

    def addPreparedness(self, city):
        cost = self.PREPARE_AMOUNT*self.PREPAREDNESS_COST
        if self.gold >= cost:
            self.cities[city-1].prepare(self.PREPARE_AMOUNT)
            self.gold -= cost
            return "Added %d%% permanent preparedness to city #%d" % (self.PREPARE_AMOUNT,city)
        else:
            return "Can't add permanent preparedness: insufficient gold."

    def addShortTerm(self, city):
        cost = self.SHORT_TERM_AMOUNT*self.SHORT_TERM_COST
        if self.cities[city-1].temporaryPreparedness != 0:
            return "Can't buy short term preparedness more than once."
        elif self.gold >= cost:
            self.cities[city-1].temporaryPrepare(self.SHORT_TERM_AMOUNT)
            self.gold -= cost
            return "Added %d%% short term preparedness to city #%d" % (self.SHORT_TERM_AMOUNT,city)
        else:
            return "Can't add short term preparedness: insufficient gold."

    def disasterRecovery(self, city):
        cost = self.HEALTH_AMOUNT*self.HEALTH_COST
        if self.gold >= cost:
            self.cities[city-1].heal(self.HEALTH_AMOUNT)
            self.gold -= cost
            return "Added %d%% health to city #%d" % (self.HEALTH_AMOUNT,city)
        else:
            return "Can't add health: insufficient gold."

    def upgradeForecasting(self):
        cost = self.UPGRADE_COST
        if self.gold >= cost:
            self.disasterGenerator.upgrade()
            self.gold -= cost
            return "You now get forecasts more often."
        else:
            return "Can't upgrade forecasting: insufficient gold."

    def generateDisasters(self):
        self.disasterGenerator.generateDisasters()

    def forecast(self):
        return self.disasterGenerator.forecast()

    def countVolunteers(self):
        return sum([city.volunteers for city in self.cities])

    def cityHealth(self):
        return [city.health for city in self.cities]

    def turn(self):
        disasters = self.disasterGenerator.turn()
        [city.turn() for city in self.cities]
        self.gold += sum(self.cityHealth())/2
        return disasters
