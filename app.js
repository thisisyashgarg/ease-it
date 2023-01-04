import express from "express";
import path from "path";
const __dirname = path.resolve();
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
import { completionCall } from "./public/js/promptCall.js";

const app = express();
const port = 4002;

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
  res.render("main", { layout: "landingPage.hbs" });
});

app.get("/homepage", (req, res) => {
  res.render("main", { layout: "homepage.hbs" });
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
    const prompt = `Give me a full day ${req.body.veg} diet plan of ${req.body.calories} calories including ${req.body.protein} gm protein for a person living in ${req.body.country} with following health complications: ${req.body.complications}`;
    completionCall(prompt)
      .then((ans) => {
        console.log(ans);
        res.render("main", {
          layout: "dietChart.hbs",
          data: `${ans.trimStart()}`,
          label: "Your Diet Chart",
          calories: req.body.calories,
          veg: req.body.veg,
          protein: req.body.protein,
          country: req.body.country,
          complications: req.body.complications,
        });
      })
      .catch((err) => console.log(err));
  });

app
  .route("/workoutplan")
  .get((req, res) => {
    res.render("main", {
      layout: "workoutplan.hbs",
      data: ``,
      label: "Your Workout Plan",
    });
  })
  .post((req, res) => {
    const prompt = `Give me a weight training plan for person with : ${req.body.bodyweight} body weight, ${req.body.calories} maintenance calories, ${req.body.frequency} times a week with ${req.body.intensity} intensity`;
    completionCall(prompt)
      .then((ans) => {
        console.log(ans);
        res.render("main", {
          layout: "workoutplan.hbs",
          data: `${ans.trimStart()}`,
          label: "Your Workout Plan",
          calories: req.body.calories,
          bodyweight: req.body.bodyweight,
          frequency: req.body.frequency,
          intensity: req.body.intensity,
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
    completionCall(prompt)
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
    completionCall(prompt)
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
  .route("/readmefromcode")
  .get((req, res) => {
    res.render("main", {
      layout: "readmefromcode.hbs",
      data: ``,
      label: "Readme",
    });
  })
  .post((req, res) => {
    const prompt = `Create a github readme for the given code,
    ${req.body.inputCode}`;
    completionCall(prompt)
      .then((ans) => {
        console.log(ans);
        res.render("main", {
          layout: "readmefromcode.hbs",
          data: `${ans}`,
          label: "Readme",
          inputCode: `${req.body.inputCode}`,
        });
      })
      .catch((err) => console.log(err));
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
    completionCall(prompt)
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
  .route("/letter")
  .get((req, res) => {
    res.render("main", {
      layout: "letter.hbs",
      data: ``,
      label: "Your Letter",
    });
  })
  .post((req, res) => {
    const prompt = `Write a ${req.body.typeOfLetter} letter in formal tone to ${req.body.recipient} about ${req.body.recipient}`;
    completionCall(prompt)
      .then((ans) => {
        console.log(ans);
        res.render("main", {
          layout: "letter.hbs",
          data: `${ans.trimStart()}`,
          label: "Your Letter",
          typeOfLetter: req.body.typeOfLetter,
          recipient: req.body.recipient,
          about: req.body.recipient,
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
    completionCall(prompt)
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

app
  .route("/storytelling")
  .get((req, res) => {
    res.render("main", {
      layout: "storytelling.hbs",
      data: ``,
      label: "Your Story",
    });
  })
  .post((req, res) => {
    const prompt = `write a story in ${req.body.words} words with Characters: ${req.body.characters}, Conflict: ${req.body.conflict} , Plot: ${req.body.plot}, setting: ${req.body.setting}, theme: ${req.body.theme}, Language:   ${req.body.language} `;
    completionCall(prompt)
      .then((ans) => {
        console.log(ans);
        res.render("main", {
          layout: "storytelling.hbs",
          data: `${ans}`,
          label: "Your Story",
          words: req.body.words,
          characters: req.body.characters,
          conflict: req.body.conflict,
          plot: req.body.plot,
          setting: req.body.setting,
          theme: req.body.theme,
          language: req.body.language,
        });
      })
      .catch((err) => console.log(err));
  });

app
  .route("/songwriting")
  .get((req, res) => {
    res.render("main", {
      layout: "songwriting.hbs",
      data: ``,
      label: "Your Song",
    });
  })
  .post((req, res) => {
    const prompt = `Write a song on ${req.body.concept} , in ${req.body.genre} genre, in ${req.body.artist}'s style, length will be ${req.body.length} , in ${req.body.language} language`;
    completionCall(prompt)
      .then((ans) => {
        console.log(ans);
        res.render("main", {
          layout: "songwriting.hbs",
          data: `${ans}`,
          label: "Your Song",
          concept: req.body.concept,
          genre: req.body.genre,
          artist: req.body.artist,
          length: req.body.length,
          language: req.body.language,
        });
      })
      .catch((err) => console.log(err));
  });

app
  .route("/poetry")
  .get((req, res) => {
    res.render("main", {
      layout: "poetry.hbs",
      data: ``,
      label: "Your Poetry",
    });
  })
  .post((req, res) => {
    const prompt = `Write a poetry on ${req.body.description} , in ${req.body.language} language, in ${req.body.rhyming} scheme`;
    completionCall(prompt)
      .then((ans) => {
        console.log(ans);
        res.render("main", {
          layout: "poetry.hbs",
          data: `${ans}`,
          label: "Your Poetry",
          description: req.body.description,
          rhyming: req.body.rhyming,
          language: req.body.language,
        });
      })
      .catch((err) => console.log(err));
  });

// app
//   .route("/generateimages")
//   .get((req, res) => {
//     res.render("main", {
//       layout: "generateimages.hbs",
//       data: ``,
//       label: "Generated Images",
//     });
//   })
//   .post((req, res) => {
//     const prompt = `${req.body.idea}`;
//     completionCall(prompt)
//       .then((ans) => {
//         console.log(ans);
//         res.render("main", {
//           layout: "generateimages.hbs",
//           data: `${ans}`,
//           label: "Generated Images",
//           idea: req.body.idea,
//         });
//       })
//       .catch((err) => console.log(err));
//   });

app.listen(port, (req, res) => {
  console.log(`listening on ${port}`);
});
