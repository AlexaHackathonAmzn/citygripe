'use strict';
var Alexa = require('alexa-sdk');
var http = require('http');

var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'City Gripe';


exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        console.log(this.event.request);

        if(this.event.request.intent) {
            if(this.event.request.intent.slots.category.value || this.event.request.intent.slots.gripe.value) {
                this.emit('GripeIntent');
            }
        }

        this.attributes['speechOutput'] = 'Welcome to ' + SKILL_NAME + '. What do you want to gripe about?';
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['repromptSpeech'] = 'I\'m sorry, I didn\'t catch that. Please try again.';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    /*
    Male Never Married: B12001_003E
    Male Divored: B12001_010E
    Male Widowed: B12001_009E
    Female Never Married: B12001_012E
    Female Divored: B12001_019E
    Female Widowed: B12001_018E
    */

    'GripeIntent': function () {

        if(this.event.request.intent.slots.category.value) {
            this.attributes['category'] = this.event.request.intent.slots.category.value;
            var category = this.attributes['category'];
        }
        if(this.event.request.intent.slots.gripe.value) {
            this.attributes['gripe'] = this.event.request.intent.slots.gripe.value;
            var gripe = this.attributes['gripe'];
        }
        if(this.attributes.gripe) {
            var gripe = this.attributes.gripe;
        }
        if(this.attributes.category) {
            var category = this.attributes.category;
        }


        if(!gripe && category) {
            if(category === 'love life' || 'relationship') {
                this.attributes['speechOutput'] = 'What part of your ' + category + ' do you want to gripe about?';
                this.attributes['repromptSpeech'] = 'I\'m sorry, I didn\'t catch that. What part of your ' + category + 'do you want to gripe about?';
            } else {
                this.attributes['speechOutput'] = 'What part  ' + category + ' do you want to gripe about?';
                this.attributes['repromptSpeech'] = 'I\'m sorry, I didn\'t catch that. What part of ' + category + 'do you want to gripe about?';
            }

            this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
        }

        if(gripe && !category) {
            this.attributes['speechOutput'] = 'What is too ' + gripe + '? You can pick job, weather, love life, commute, or nature.';
            this.attributes['repromptSpeech'] = 'I\'m sorry, I didn\'t catch that. What is too ' + gripe + '? You can pick job, weather, love life, commute, or nature.';
            this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
        }

        if(!gripe && !category) {
            this.attributes['speechOutput'] = 'I\'m sorry, I don\'t  understand the gripe. Please try rephrasing.';
            this.attributes['repromptSpeech'] = 'I\'m sorry, I don\'t  understand the gripe. You can gripe about things like your job, weather, love life, commute, or nature';
            this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
        }

        if(gripe && category) {
            if(category === "love life" || category === "relationship") {
                relationshipGripe(gripe);

            } else {

                this.attributes['speechOutput'] = 'Oh, I hate ' + gripe + ' too. You should move to Seattle';
                this.emit(':tell', this.attributes['speechOutput']);
            }
        }

        var self = this;

        function relationshipGripe(gripe) {

            http.get("http://api.census.gov/data/2015/acs1?get=NAME,B12001_003E,B12001_010E,B12001_009E,B12001_012E,B12001_019E,B12001_018E&for=county:*&in=state:*&key=75fc172bae13c20d3e52aca76885f3db7a12075a", function(res) {
                var string = '';
                res.on('data', function(chunk) {
                    string += chunk;
                });

                res.on('end', function() {
                    var json = JSON.parse(string);

                    var array = Object.keys(json).map(function(key) {
                        return json[key];
                    });

                    var ran = Math.floor(Math.random() * array.length);
                    var county = array[ran];
                    console.log('hello', county);
                    if(gripe === 'women') {
                        var womenTotal = parseInt(county[4]) + parseInt(county[5]) + parseInt(county[6]);
                        self.attributes['speechOutput'] = 'You could always move to ' + county[0] + ' where there is ' + womenTotal + ' single women.';
                        self.emit(':tell', self.attributes['speechOutput']);
                    }

                    if(gripe === 'men') {
                        var menTotal = parseInt(county[1]) + parseInt(county[2]) + parseInt(county[3]);
                        self.attributes['speechOutput'] = 'You could always move to ' + county[0] + ' where there is ' + menTotal + ' single men.';
                        self.emit(':tell', self.attributes['speechOutput']);

                    }

                });

            }).on('error', function(e) {
            }).end();
        }

    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can say tell me a space fact, or, you can say exit... What can I help you with?";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }
};
