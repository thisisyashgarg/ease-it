import express from 'express'
import path from 'path';
const __dirname = path.resolve();
import bodyParser from 'body-parser';
import exphbs from 'express-handlebars'
import ejs from 'ejs'
import { openAICall } from './public/js/aiCall.js';

const app = express();
const port = 4000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'hbs');
app.engine('hbs', exphbs.engine({
     extname: '.hbs', 
     defaultLayout: "main",
     layoutsDir: __dirname+ '/views/layouts',
     partialsDir: __dirname+ '/views/partials'
}));

app.get('/homepage', (req, res)=>{
    res.render('main', {layout: 'homepage.hbs'})
})

app.get('/messages', (req, res)=>{
    res.render('main', {layout: 'messages.hbs', data: ``, label: 'Your Personalised Message'})

})

app.post('/messages', (req, res) =>{
    const prompt = `Person A: ${req.body.replyToMessage}, Person B : ${req.body.replyToBeSent}, a more refined answer person B will give in response to Person A, in ${req.body.language} language, with ${req.body.sentiment} sentiment, with multiple tone ${req.body.tone}`;
    openAICall(prompt)
    .then(ans =>{
        console.log(ans);
        res.render('main', {layout: 'messages.hbs', data: `${ans}`, label: 'Your Personalised Message'})
    })
    .catch(err => console.log(err));
})

app.get('/dietchart', (req, res)=>{
    res.render('main', {layout: 'dietChart.hbs', data: ``, label: 'Your Diet Chart'})
})

app.post('/dietchart', (req, res)=>{
    const prompt = `Give me a full day diet plan of ${req.body.calories} calories including ${req.body.carbs} gm carbohydrates, ${req.body.fats} gm fats and ${req.body.protein} gm protein`;
    openAICall(prompt)
    .then(ans =>{
        console.log(ans);
        res.render('main', {layout: 'dietChart.hbs', data: `${ans}`, label: 'Your Diet Chart'})
    })
    .catch(err => console.log(err)); 
})

app.get('/debugcode', (req, res)=>{
    res.render('main', {layout: 'debugCode.hbs', data: ``, label: 'Debugged Code'})
})

app.post('/debugcode', (req, res)=>{
    const prompt = `, find errors in the code given below,
    ${req.body.inputCode}`
    openAICall(prompt)
    .then(ans =>{
        console.log(ans);
        res.render('main', {layout: 'debugCode.hbs', data: `${ans}`, label: 'Debugged Code'})
    })
    .catch(err => console.log(err)); 
   
})

app.get('/codeexplanation', (req, res)=>{
    res.render('main', {layout: 'codeExplanation.hbs', data: ``, label: 'Explanation'})

})


app.post('/codeexplanation', (req, res)=>{
    const prompt = `, Explain the code given below,
    ${req.body.inputCode}`
    openAICall(prompt)
    .then(ans =>{
        console.log(ans);
        res.render('main', {layout: 'codeExplanation.hbs', data: `${ans}`, label: 'Explanation'})
    })
    .catch(err => console.log(err));  
})

app.listen(port,(req, res) =>{
   console.log(`listening on ${port}`)
})

