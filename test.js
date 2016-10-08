   if(!gripe && category) {
           if(category === 'love life' || category === 'relationship') {
             this.attributes['speechOutput'] = 'Are you interested in men or women?';
             this.attributes['repromptSpeech'] = 'I\'m sorry, I didn\'t catch that. Are you interested in men or women?';
           } else if (category === 'job' || category === 'commute') {
               this.attributes['speechOutput'] = 'What part of your ' + category + ' do you want to gripe about?';
               this.attributes['repromptSpeech'] = 'I\'m sorry, I didn\'t catch that. What part of your ' + category + 'do you want to gripe about?';
           } else {
             // Weather, Nature
               this.attributes['speechOutput'] = 'What about the ' + category + ' do you want to gripe about?';
               this.attributes['repromptSpeech'] = 'I\'m sorry, I didn\'t catch that. What part of ' + category + 'do you want to gripe about?';
           }

           this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
       }

       if(gripe && !category) {
         if(gripe === 'men' || gripe === 'women'){
           relationshipGripe(gripe);
         } else {
           this.attributes['speechOutput'] = 'What is too ' + gripe + '? You can pick job, weather, love life, commute, or nature.';
           this.attributes['repromptSpeech'] = 'I\'m sorry, I didn\'t catch that. What is too ' + gripe + '? You can pick job, weather, love life, commute, or nature.';
           this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
         }
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
