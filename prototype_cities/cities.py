class City:
    def __init__(self):
        self.health = 100.0
        self.preparedness = 0.0
        self.volunteers = 0.0
        self.temporaryPreparedness = 0.0

    def turn(self):
        self.volunteers += self.preparedness
        self.temporaryPreparedness = 0.0

    def disasterHits(self, damage):
        self.health -= max(0,damage-(self.preparedness+self.temporaryPreparedness)/2.)

    def heal(self, extraHealth):
        self.health = min(100,self.health+extraHealth)

    def prepare(self, extraPreparedness):
        self.preparedness = min(100,self.preparedness+extraPreparedness)

    def temporaryPrepare(self, temporaryPreparedness):
        self.temporaryPreparedness += temporaryPreparedness

    def __repr__(self):
        return "Health:\t\t %.2f%%\nPreparedness:\t %.2f%%\nVolunteers:\t %.2f\n" % (self.health,self.preparedness+self.temporaryPreparedness,self.volunteers)

    def __str__(self):
        return self.__repr__()
