forecasters
===========

Forecast Based Financing videogame group for the 6.073 course at MIT 2014

Installing and Running
======================

First off, you need to install node and npm. There are a lot of tutorials on how to do that online so it's assumed you have the latest version up and running.

Then, go to the root directory of the forecasters repository and run the following commands. Depending on your system, you might need to run `npm install -g *` commands using sudo/admin.

```
npm install
npm install -g bower
npm install -g grunt-cli
npm install -g gaussian
bower install
```

Now, everything is set up and ready to run. To run, all you have to do is

```
grunt
```

The server will automatically look for changes to the javascript files in the game/ directory and reload when there are changes.

***
