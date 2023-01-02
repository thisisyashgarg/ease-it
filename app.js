import express from "express";
import path from "path";
const __dirname = path.resolve();
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
import { completionCall } from "./public/js/promptCall.js";
import dotenv from "dotenv";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session"; //The session middleware function is used to manage sessions in Express. It allows you to store data in a session object, which is available on the request object in your route handlers.
import passportLocalMongoose from "passport-local-mongoose";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import findOrCreate from "mongoose-findorcreate";
dotenv.config();

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

////////////////////////////////////////////////////////////////////////////////////
app.use(
  session({
    //The app.use() method is used to add middleware functions to an Express application.
    secret: "Our little Secret", //This option is used to set a secret string that will be used to sign the session ID cookie.
    resave: false, //This option is used to specify whether the session should be saved even if it has not been modified. If this option is set to false, the session will only be saved if it has been modified.
    saveUninitialized: false, //This option is used to specify whether uninitialized sessions should be saved. If this option is set to false, uninitialized sessions will not be saved.
  })
);

app.use(passport.initialize()); //initialized passport
app.use(passport.session()); //used passport to manage all sessions

mongoose.connect(
  `mongodb+srv://ankitpandey:ankitpandey@cluster0.kvppdtr.mongodb.net/easeit?retryWrites=true&w=majority`,
  function (err) {
    if (!err) {
      console.log("connected to db");
    } else {
      console.log(err);
    }
  }
);
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String,
});

userSchema.plugin(passportLocalMongoose); //The schema also uses the passport-local-mongoose plugin to add methods for handling user authentication with username and password credentials. The plugin provides methods such as register(), authenticate(), and serializeUser(), which can be used to register new users, authenticate existing users, and serialize user data for storing in a session.
userSchema.plugin(findOrCreate); //

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy()); // This line uses the passport.use() method to add a new authentication strategy to Passport. In this case, the strategy is created using the createStrategy() method provided by the passport-local-mongoose plugin. This strategy allows the app to authenticate users with username and password credentials using the User model.

passport.serializeUser((user, done) => {
  //serializeUser() method is called when a user is authenticated, and it is used to convert the user object to a unique identifier. This identifier is then stored in the session object, which allows the app to keep track of the authenticated user across multiple requests.
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  //deserializeUser() method is called when the app needs to access the user data in the session, and it is used to convert the identifier back into the user object.
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:4002/auth/google/homepage",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      // Use the profile information to create a new user or log them in
      User.findOrCreate({ googleId: profile.id }, (err, user) => {
        return cb(err, user);
      });
    }
  )
);

/////////////////////////////////passport//////////////////////////////////////////

app.get("/", (req, res) => {
  res.render("main", { layout: "landingPage.hbs" });
});

app.get("/homepage", (req, res) => {
  User.find(function (err, foundUsers) {
    if (err) {
      console.log(err);
    } else {
      if (foundUsers) {
        res.render(
          "main",
          { layout: "homepage.hbs" }
          // { usersWithSecrets: foundUsers }
        );
      }
    }
  });
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

//////////////////////////////////////////////////////////////////

app.get(
  "/auth/google", //This route handler is for the GET method and the /auth/google URL. It uses the passport.authenticate() method to initiate the Google OAuth 2.0 authentication process. This method will redirect the user to the Google login page, where they can grant the app access to their Google profile.
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/homepage",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.render("main", { layout: "homepage.hbs" });
  }
);

app.get("/homepage", function (req, res) {
  if (req.isAuthenticated) {
    res.render("main", { layout: "homepage.hbs" });
  } else {
    res.redirect("/");
  }
});

app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

//////////////////////////////////POST requests//////////////////////////////////////

app.listen(port, (req, res) => {
  console.log(`listening on ${port}`);
});
