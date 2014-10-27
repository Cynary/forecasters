import random

class Disasters:
    INITIAL_PERIOD = 4
    DISASTER_DAMAGE = 50

    def __init__(self):
        self.cities = []
        self.period = self.INITIAL_PERIOD
        self.n = 0

    def addCity(self, city):
        self.cities.append(city)

    def generateDisasters(self):
        self.probs = [min(abs(random.gauss(0,0.15)),1.) for _ in self.cities]

    def forecast(self):
        forecast = ""
        if self.n == 0:
            forecast = "*** Forecast for this turn ***\n%s\n" % "\n".join(["City #%d: %.2f%% probability of disaster" % (i+1, prob*100) for i,prob in enumerate(self.probs)])
        else:
            forecast = "No forecast for this turn. Upgrade to get more frequent forecasts.\n"
        self.n = (self.n+1)%self.period
        return forecast

    def upgrade(self):
        if self.period != 1:
            self.period -= 1
            self.n %= self.period

    def turn(self):
        disasters = ""
        for i,(city,prob) in enumerate(zip(self.cities,self.probs)):
            deciding = random.random()
            if deciding <= prob:
                disasters += "Disaster hit in city #%d\n" % (i+1)
                disasters += city.disasterHits(self.DISASTER_DAMAGE)
            else:
                disasters += "It was a normal day in city #%d\n" % (i+1)
                if city.temporaryPreparedness != 0:
                    disasters += "Your citizens are not happy with you for wasting your money on short term preparedness.\n"
        return disasters