
const Alexa = require('ask-sdk-core');
const axios = require('axios');
const logic = require('./logic');
const constants = require('./constants');
const util = require('./util'); // utility functions
const interceptors = require('./interceptors');
const moment = require('moment-timezone'); 

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes['lastIntent'] = "LaunchRequest";
        const name = sessionAttributes['name'] || '';
        
        const speakOutput = !sessionAttributes['sessionCounter'] ? handlerInput.t('WELCOME_MSG', {name: name}) : handlerInput.t('WELCOME_BACK_MSG', {name: name});
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    
    }
};

const GetDebriefingIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetDebriefing';
    },
    async handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var speechText = "My pleasure, here's your briefing: ";
        
        if(!sessionAttributes['favorites'] || sessionAttributes['favorites'].length === 0) {
            speechText = "You have no topics saved to your favorites. To add to your favorites, ask me to add a topic from a supported news source.";
            return handlerInput.responseBuilder.speak(speechText).getResponse();
        }
        
        for(let i = 0; i < sessionAttributes['favorites'].length; i++){
            var group = sessionAttributes['favorites'][i].split("-")
            var topic = group[0];
            var newsSource = group[1];
            speechText += "From " + newsSource + ", here are the top " + topic + " headlines: " + handlerInput.t('SHORT_PAUSE');
            speechText += await logic.fetchArticles(newsSource, topic, handlerInput);
            speechText += handlerInput.t('KEYBOARD_SOUND');
        }
        speechText += " Would you like to hear about any other topics? You've listened to ";
        for(let i = 0; i < sessionAttributes['lastThreeTopics'].length; i++) {
            if(i === sessionAttributes['lastThreeTopics'].length - 1) {
                speechText += "and " + sessionAttributes['lastThreeTopics'][i];
            } else {
                speechText += sessionAttributes['lastThreeTopics'][i] + ", "
            }
        }
        speechText += " most recently."
        return handlerInput.responseBuilder.speak(speechText).getResponse();
    }
}

const ListAllTopicsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ListAllTopics'
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes['lastIntent'] = "ListAllTopics";
        
        var list = "Here's a list of the news topics I can read: ";
        var topics = Object.keys(constants.Topics_to_Sources);
        
        topics.forEach(topic => list += topic + ", ");
        
        list = list.substring(0, list.length - 2);
        list += ". "
        
        list += " You've listened to ";
        for(let i = 0; i < sessionAttributes['lastThreeTopics'].length; i++) {
            if(i === sessionAttributes['lastThreeTopics'].length - 1) {
                list += "and " + sessionAttributes['lastThreeTopics'][i];
            } else {
                list += sessionAttributes['lastThreeTopics'][i] + ", "
            }
        }
        list += " most recently. If you're not sure what to listen to you can try one of those again! "
        
        return handlerInput.responseBuilder
            .speak(list)
            .addDelegateDirective('GetNews')
            .withShouldEndSession(false)
            .getResponse();
        
    }
}

const GetNewsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetNews'
            && Alexa.getDialogState(handlerInput.requestEnvelope) !== 'COMPLETED';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.addDelegateDirective().getResponse();
    }
};

const GetSourceIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetNews'
            && Alexa.getSlotValue(handlerInput.requestEnvelope, 'Topics')
            && !Alexa.getSlotValue(handlerInput.requestEnvelope, 'NewsSource');
    },
    async handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        //sessionAttributes['topic'] = handlerInput.requestEnvelope.request.intent.slots.Topics.resolutions.resolutionsPerAuthority[0].values[0].value.name.toUpperCase();
        sessionAttributes['topic'] = handlerInput.requestEnvelope.request.intent.slots.Topics.resolutions ? handlerInput.requestEnvelope.request.intent.slots.Topics.resolutions.resolutionsPerAuthority[0].values[0].value.name.toUpperCase() : handlerInput.requestEnvelope.request.intent.slots.Topics.value.toUpperCase();
        var topic = sessionAttributes['topic'];
        if(sessionAttributes['lastIntent'] !== "ListSupportedTopics") {
            sessionAttributes['newsSource'] = undefined;
        }
        if(sessionAttributes['lastThreeTopics'].includes(topic)){
            for( var i = 0; i < sessionAttributes['lastThreeTopics'].length; i++){ 
                if ( sessionAttributes['lastThreeTopics'][i] === topic) { 
                    sessionAttributes['lastThreeTopics'].splice(i, 1); 
                }
            }
        } else if(sessionAttributes['lastThreeTopics'].length === 3){
            sessionAttributes['lastThreeTopics'].shift();
        }
        sessionAttributes['lastThreeTopics'].push(topic);
        
        if(topic === "GOOD NEWS") {
            handlerInput.requestEnvelope.request.intent.slots.NewsSource.value = "Good News Network";
            return RetrievedNewsIntentHandler.handle(handlerInput);
        }
        if(topic === "CELEBRITY NEWS") {
            handlerInput.requestEnvelope.request.intent.slots.NewsSource.value = "TMZ";
            return RetrievedNewsIntentHandler.handle(handlerInput);
        }
        if(topic === "ARTS") {
            handlerInput.requestEnvelope.request.intent.slots.NewsSource.value = "The New York Times";
            return RetrievedNewsIntentHandler.handle(handlerInput);
        }
        
        if(sessionAttributes['lastIntent'] === "ListSupportedTopics") {
            handlerInput.requestEnvelope.request.intent.slots.NewsSource.value = sessionAttributes['newsSource'];
            return RetrievedNewsIntentHandler.handle(handlerInput);
        }
        
        var speechText = handlerInput.t('WHICH_SOURCE_MSG', {topic: topic});
        for(let i = 0; i < constants.Topics_to_Sources[topic].length; i++){
            if(i === (constants.Topics_to_Sources[topic].length - 2)) {
                speechText += constants.Topics_to_Sources[topic][i] + ", and "
            } else if(i === (constants.Topics_to_Sources[topic].length - 1)) {
                speechText += constants.Topics_to_Sources[topic][i];
            } else {
                speechText += constants.Topics_to_Sources[topic][i] + ", ";
            }
        }
        speechText += " pulled up."
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .addElicitSlotDirective('NewsSource')
            .withShouldEndSession(false)
            .getResponse();
    }
};

const RetrievedNewsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetNews'
            && Alexa.getSlotValue(handlerInput.requestEnvelope, 'Topics')
            && Alexa.getSlotValue(handlerInput.requestEnvelope, 'NewsSource');
    },
    async handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        var newsSource = "";
        if(handlerInput.requestEnvelope.request.intent.slots.NewsSource.resolutions) {
            newsSource = handlerInput.requestEnvelope.request.intent.slots.NewsSource.resolutions.resolutionsPerAuthority[0].values[0].value.name.toUpperCase();
        }
        else {
            newsSource = handlerInput.requestEnvelope.request.intent.slots.NewsSource.value.toUpperCase();
        }
        sessionAttributes['newsSource'] = newsSource;
        
        var topic = handlerInput.requestEnvelope.request.intent.slots.Topics.value.toUpperCase();
        if(handlerInput.requestEnvelope.request.intent.slots.Topics.resolutions) {
            topic = handlerInput.requestEnvelope.request.intent.slots.Topics.resolutions.resolutionsPerAuthority[0].values[0].value.name.toUpperCase();
        }
    
        var speechText = handlerInput.t('PRESENTING_NEWS_MSG', {topic: topic, newsSource: newsSource})
        
        if(constants.Topics_to_Sources[topic].includes(newsSource)) {
            speechText += await logic.fetchArticles(newsSource, topic, handlerInput);
            
            // dialog code - after news is read, ask if user would like to hear about the topic from a different source, or hear about a different topic
            /*
            for(let i = 0; i < constants.Topics_to_Sources[topic].length; i++) {
                if(constants.Topics_to_Sources[topic][i] !== newsSource) {
                    speechText += " Let me know if you would like to hear about " + topic + " from another news source or hear about a different topic. " 
                    break;
                }
            }
            */
            
            if(constants.Topics_to_Sources[topic].length > 1) {
                if(constants.Topics_to_Sources[topic].length === 2 && sessionAttributes['lastIntent'] === 'ChangeSource') {
                    speechText += " Is there another topic you would like to hear about? " 
                } else {
                    speechText += " Let me know if you would like to hear about " + topic + " from another news source or hear about a different topic. " 
                }
            }
            
            if(constants.Topics_to_Sources[topic].length === 1) {
                speechText += " Is there another topic you would like to hear about? "
            }
            
        } else {
                speechText = handlerInput.t('UNPROVIDED_MSG', {topic: topic, newsSource: newsSource}) + " ";
                for(let i = 0; i < constants.Topics_to_Sources[topic].length; i++){
                    if(i === (constants.Topics_to_Sources[topic].length - 1)) {
                        speechText += "and " + constants.Topics_to_Sources[topic][i];
                    } else {
                        speechText += constants.Topics_to_Sources[topic][i] + ", ";
                    }
                }
                speechText += " all report on " + topic + ".";
        }
        
        if(sessionAttributes['lastIntent'] !== 'ChangeTopics' || sessionAttributes['lastIntent'] !== 'ChangeSource') {
            sessionAttributes['lastIntent'] = "GetNews";
        }
        return handlerInput.responseBuilder.speak(speechText).withShouldEndSession(false).getResponse();
    }
}

const ChangeTopicsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChangeTopics'
            && Alexa.getSlotValue(handlerInput.requestEnvelope, 'Topics');
    },
    async handle(handlerInput) {
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes['topic'] = handlerInput.requestEnvelope.request.intent.slots.Topics.resolutions.resolutionsPerAuthority[0].values[0].value.name.toUpperCase();
        var topic = sessionAttributes['topic'];
        
        if(sessionAttributes['lastThreeTopics'].includes(topic)){
            for( var i = 0; i < sessionAttributes['lastThreeTopics'].length; i++){ 
                if ( sessionAttributes['lastThreeTopics'][i] === topic) { 
                    sessionAttributes['lastThreeTopics'].splice(i, 1); 
                }
            }
        } else if(sessionAttributes['lastThreeTopics'].length === 3){
            sessionAttributes['lastThreeTopics'].shift();
        }
        sessionAttributes['lastThreeTopics'].push(topic);
        
        if(!sessionAttributes['newsSource']) {
            sessionAttributes['newsSource'] = constants.Topics_to_Sources[topic][0];
        }
        
        if(!handlerInput.requestEnvelope.request.intent.slots.NewsSource.value) {
            handlerInput.requestEnvelope.request.intent.slots.NewsSource.value = sessionAttributes['newsSource'];
        }
        else {
            sessionAttributes['newsSource'] = handlerInput.requestEnvelope.request.intent.slots.NewsSource.resolutions.resolutionsPerAuthority[0].values[0].value.name.toUpperCase();
        }
        
        
        sessionAttributes['lastIntent'] = "ChangeTopics";
        return RetrievedNewsIntentHandler.handle(handlerInput);
    }
};

const RequestedNewSourceIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChangeSource'
            && !Alexa.getSlotValue(handlerInput.requestEnvelope, 'NewsSource');
    },
    async handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var topic = sessionAttributes['topic'];
        
        var speechText = "Sure! What source? "
        
        for(let i = 0; i < constants.Topics_to_Sources[topic].length; i++){
            if(i === (constants.Topics_to_Sources[topic].length - 2)) {
                speechText += constants.Topics_to_Sources[topic][i] + ", and "
            } else if(i === (constants.Topics_to_Sources[topic].length - 1)) {
                speechText += constants.Topics_to_Sources[topic][i];
            } else {
                speechText += constants.Topics_to_Sources[topic][i] + ", ";
            }
        }
        speechText += " report on " + topic + ".";
        
        return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).addElicitSlotDirective('NewsSource').getResponse();
        
    }
}

const ChangeSourceIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChangeSource'
            && Alexa.getSlotValue(handlerInput.requestEnvelope, 'NewsSource');
    },
    async handle(handlerInput) {
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes['newsSource'] = handlerInput.requestEnvelope.request.intent.slots.NewsSource.value.toUpperCase();
        
        
        if(!handlerInput.requestEnvelope.request.intent.slots.Topics.value) {
            handlerInput.requestEnvelope.request.intent.slots.Topics.value = sessionAttributes['topic'];
        }
        else {
            sessionAttributes['topic'] = handlerInput.requestEnvelope.request.intent.slots.Topics.resolutions.resolutionsPerAuthority[0].values[0].value.name.toUpperCase();
        }
        
        
        sessionAttributes['lastIntent'] = "ChangeSource";
        return RetrievedNewsIntentHandler.handle(handlerInput);
        
        /*
        return handlerInput.responseBuilder
            .addDelegateDirective({
                name: "GetNews",
                confirmationStatus: "NONE",
                slots: {
                    "Topics": {
                        name: "Topics",
                        confirmationStatus: "NONE",
                        value: sessionAttributes['topic']
                    },
                    "NewsSource": {
                        name: "NewsSource",
                        confirmationStatus: "NONE",
                        value: sessionAttributes['newsSource']
                    }
                }
            }).getResponse();
       */ 
    }
};

const ListSupportedTopicsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ListSupportedTopics';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes['newsSource'] = handlerInput.requestEnvelope.request.intent.slots.NewsSource.resolutions.resolutionsPerAuthority[0].values[0].value.name.toUpperCase();
        var newsSource = sessionAttributes['newsSource'];
        
        sessionAttributes['lastIntent'] = "ListSupportedTopics";
        
        var list = "Here are the topics that " + newsSource + " reports on: ";
        var topics = [];
        
        switch(newsSource) {
            case "CNN NEWS": topics = Object.keys(constants.CNN_RSS_MAP); break;
            case "NBC NEWS": topics = Object.keys(constants.NBC_RSS_MAP); break;
            case "TMZ": topics = Object.keys(constants.TMZ_RSS_MAP); break;
            case "GOOD NEWS NETWORK": topics = Object.keys(constants.GNN_RSS_MAP); break;
        }

        topics.forEach(topic => list += topic + ", ");
        
        list = list.substring(0, list.length - 2);
        list += ". "
        
        return handlerInput.responseBuilder
            .speak(list)
            .reprompt(list)
            .withShouldEndSession(false)
            .getResponse();
        
    }
}

const AddToFavoritesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'EditFavorites'
            && Alexa.getSlotValue(handlerInput.requestEnvelope, 'Action') === "add";
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var topic = handlerInput.requestEnvelope.request.intent.slots.Topic.value ? handlerInput.requestEnvelope.request.intent.slots.Topic.resolutions.resolutionsPerAuthority[0].values[0].value.name.toUpperCase() : sessionAttributes["topic"];
        var newsSource = handlerInput.requestEnvelope.request.intent.slots.NewsSource.value ? handlerInput.requestEnvelope.request.intent.slots.NewsSource.resolutions.resolutionsPerAuthority[0].values[0].value.name.toUpperCase() : sessionAttributes["newsSource"];
        
        if(!constants.Topics_to_Sources[topic].includes(newsSource)) {
            var speechText = handlerInput.t('UNSUPPORTED_TOPIC_MSG', {topic: topic, newsSource: newsSource});
            speechText += " Why don't you try listening to " + topic + " from " + constants.Topics_to_Sources[topic][0] + " instead and add it to favorites?"
            return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
        }
        
        if(!sessionAttributes['favorites']) {
            sessionAttributes['favorites'] = [topic + "-" + newsSource];
        } else if(!sessionAttributes['favorites'].includes(topic + "-" + newsSource)) {
            sessionAttributes['favorites'].push(topic + "-" + newsSource);
        }

        return handlerInput.responseBuilder
            .speak("Done! " + topic + " from " + newsSource + " added to your favorites!")
            .getResponse();
    }
}

const RemoveFromFavoritesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'EditFavorites'
            && Alexa.getSlotValue(handlerInput.requestEnvelope, 'Action') === "remove";
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var topic = handlerInput.requestEnvelope.request.intent.slots.Topic.value ? handlerInput.requestEnvelope.request.intent.slots.Topic.resolutions.resolutionsPerAuthority[0].values[0].value.name.toUpperCase() : sessionAttributes["topic"];
        var newsSource = handlerInput.requestEnvelope.request.intent.slots.NewsSource.value ? handlerInput.requestEnvelope.request.intent.slots.NewsSource.resolutions.resolutionsPerAuthority[0].values[0].value.name.toUpperCase() : sessionAttributes["newsSource"];
        
        if(sessionAttributes['favorites']) {
            for(let i = 0; i < sessionAttributes['favorites'].length; i++) {
                if(sessionAttributes['favorites'][i] === (topic + "-" + newsSource)){
                    sessionAttributes['favorites'].splice(i,1);
                }
            }
        }

        return handlerInput.responseBuilder
            .speak("Done! " + topic + " from " + newsSource + " has been removed from your favorites!")
            .getResponse();
    }
}

const UseInstructionsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'UseInstructions';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('INSTRUCTIONS_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t("GOODBYE_MSG");

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t("FALLBACK_MSG");

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); 
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = handlerInput.t('REFLECTOR_MSG', {intent: intentName});

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = handlerInput.t("ERROR_MSG");
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetDebriefingIntentHandler,
        ListAllTopicsIntentHandler,
        GetNewsIntentHandler,
        GetSourceIntentHandler,
        RetrievedNewsIntentHandler,
        ChangeTopicsIntentHandler,
        RequestedNewSourceIntentHandler,
        ChangeSourceIntentHandler,
        ListSupportedTopicsIntentHandler,
        AddToFavoritesIntentHandler,
        RemoveFromFavoritesIntentHandler,
        UseInstructionsIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        interceptors.LoadAttributesRequestInterceptor,
        interceptors.LoggingRequestInterceptor,
        interceptors.LocalisationRequestInterceptor,
        interceptors.LoadNameRequestInterceptor,
        interceptors.LoadTimezoneRequestInterceptor)
    .addResponseInterceptors(
        interceptors.LoggingResponseInterceptor,
        interceptors.SaveAttributesResponseInterceptor)
    .withPersistenceAdapter(util.getPersistenceAdapter())
    .withApiClient(new Alexa.DefaultApiClient())
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();