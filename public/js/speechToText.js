//elements to be triggerred
const textFromSpeechBox = document.getElementById('replyToMessage')
const buttonToRecordSpeech = document.getElementById('mic');

//necessities for speech recognition, interfaces reqd
const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList =  window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

//basic grammar 
const grammer = '#JSGF v1.0;';

const recognition = new SpeechRecognition();
const speechRecognitionGrammerList = new SpeechGrammarList();

//adding grammar to created object
speechRecognitionGrammerList.addFromString(grammer, 1);
//adding grammar to created recognition
recognition.grammars = speechRecognitionGrammerList;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.continuous = true;


recognition.onresult = (input) => {
    // console.log(input);
    const last = input.results.length -1;
    const dataToBeTranscripted = input.results[last][0].transcript;
    textFromSpeechBox.innerHTML = `${dataToBeTranscripted}`;
    // console.log(openAICall(dataToBeTranscripted) );   
}

//stop when user stops
recognition.onspeechend = () =>{
    recognition.stop();
}

recognition.onerror = (error) =>{
    textFromSpeechBox.textContent = `Error occured in recognition: ${error}`
}

buttonToRecordSpeech.addEventListener('click', () =>{
    recognition.start();
})













    
