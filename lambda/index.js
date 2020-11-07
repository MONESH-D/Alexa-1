/* eslint-disable no-use-before-define */
/* eslint-disable global-require */

const Alexa = require('ask-sdk-core');
const axios = require('axios');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome, to Candies Counter';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const GetRemoteDataHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
      || (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetRemoteDataIntent');
  },
  async handle(handlerInput) {
    let outputSpeech = 'This is the default message.';
    
        const fun = handlerInput.requestEnvelope.request.intent.slots.fun.value;
        const num = handlerInput.requestEnvelope.request.intent.slots.num.value;
        var con;
         
         fun === "add"? con =1: fun === "remove" ?con = 2:con =3;
        //   outputSpeech = `printed ${con}, `;
          outputSpeech = `printed ${fun}, `;
         
//     if(con ===1 ){
//       await  axios.post("https://srmalexa.herokuapp.com/", {count: num})
//           outputSpeech = `printed ${num}, `;
//     }
//     else if(con ===2){
//          let promise = await axios.get("https://srmalexa.herokuapp.com/");
//     console.log(promise.data)
//     var v = promise.data - num;
    
//   await axios.put('https://srmalexa.herokuapp.com/', {count: v});
//         outputSpeech = `printed ${v}, `;
//     }
//     else{
//          let promise = await axios.get("https://srmalexa.herokuapp.com/");
//     console.log(promise.data)
//       outputSpeech = `printed ${promise.data}, `;
        
//     }
  

// https://srmalexa.herokuapp.com/
    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can introduce yourself by telling me your name';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const getRemoteData = (url) => new Promise((resolve, reject) => {
  const client = url.startsWith('https') ? require('https') : require('http');
  const request = client.get(url, (response) => {
    if (response.statusCode < 200 || response.statusCode > 299) {
      reject(new Error(`Failed with status code: ${response.statusCode}`));
    }
    const body = [];
    response.on('data', (chunk) => body.push(chunk));
    response.on('end', () => resolve(body.join('')));
  });
  request.on('error', (err) => reject(err));
});

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    GetRemoteDataHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
