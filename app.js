import express from "express";
import path from "path";
const __dirname = path.resolve();
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
import { openAICall } from "./public/js/aiCall.js";

const app = express();
const port = 4000;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);

app.get("/", (req, res) => {
  res.render("main", { layout: "homepage.hbs" });
});

app
  .route("/messages")
  .get((req, res) => {
    res.render("main", {
      layout: "messages.hbs",
      data: ``,
      label: "Your Personalised Message",
    });
  })
  .post((req, res) => {
    const prompt = `Person A: ${req.body.replyToMessage}, Person B : ${req.body.replyToBeSent}, a better answer person B will give in response to Person A, in ${req.body.language} language, with ${req.body.sentiment} sentiment, with tone ${req.body.tone}`;
    openAICall(prompt)
      .then((ans) => {
        console.log(ans);
        res.render("main", {
          layout: "messages.hbs",
          data: `${ans.trimStart()}`,
          label: "Your Personalised Message",
          language: req.body.language,
          replyToMessage: req.body.replyToMessage,
          replyToBeSent: req.body.replyToBeSent,
          sentiment: req.body.sentiment,
          tone: req.body.tone,
        });
      })
      .catch((err) => console.log(err));
  });

app
  .route("/dietchart")
  .get((req, res) => {
    res.render("main", {
      layout: "dietChart.hbs",
      data: ``,
      label: "Your Diet Chart",
    });
  })
  .post((req, res) => {
    const prompt = `Give me a full day diet plan of ${req.body.calories} calories including ${req.body.carbs} gm carbohydrates, ${req.body.fats} gm fats and ${req.body.protein} gm protein`;
    openAICall(prompt)
      .then((ans) => {
        console.log(ans);
        res.render("main", {
          layout: "dietChart.hbs",
          data: `${ans.trimStart()}`,
          label: "Your Diet Chart",
          calories: req.body.calories,
          carbs: req.body.carbs,
          protein: req.body.protein,
          fats: req.body.fats,
        });
      })
      .catch((err) => console.log(err));
  });

app
  .route("/debugcode")
  .get((req, res) => {
    res.render("main", {
      layout: "debugCode.hbs",
      data: ``,
      label: "Debugged Code",
    });
  })
  .post((req, res) => {
    const prompt = `, find errors in the code given below,
    ${req.body.inputCode}`;
    openAICall(prompt)
      .then((ans) => {
        console.log(ans);
        res.render("main", {
          layout: "debugCode.hbs",
          data: `${ans.trimStart()}`,
          label: "Debugged Code",
          inputCode: `${req.body.inputCode}`,
        });
      })
      .catch((err) => console.log(err));
  });

app
  .route("/codeexplanation")
  .get((req, res) => {
    res.render("main", {
      layout: "codeExplanation.hbs",
      data: ``,
      label: "Explanation",
    });
  })
  .post((req, res) => {
    const prompt = `Explain the code given below,
    ${req.body.inputCode}`;
    openAICall(prompt)
      .then((ans) => {
        console.log(ans);
        res.render("main", {
          layout: "codeExplanation.hbs",
          data: `${ans}`,
          label: "Explanation",
          inputCode: `${req.body.inputCode}`,
        });
      })
      .catch((err) => console.log(err));
  });

app
  .route("/ama")
  .get((req, res) => {
    res.render("main", {
      layout: "askmeanything.hbs",
      data: ``,
      label: "Your response",
    });
  })
  .post((req, res) => {
    const prompt = `${req.body.ama}`;
    openAICall(prompt)
      .then((ans) => {
        console.log(ans);
        res.render("main", {
          layout: "askmeanything.hbs",
          data: `${ans}`,
          label: "Your response",
          ama: `${req.body.ama}`,
        });
      })
      .catch((err) => console.log(err));
  });

app.listen(port, (req, res) => {
  console.log(`listening on ${port}`);
});
