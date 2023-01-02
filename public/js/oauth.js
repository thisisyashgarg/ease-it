//jshint esversion:6

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
  `mongodb+srv://yashgarg:yashgarg@cluster0.fhdwxom.mongodb.net/?retryWrites=true&w=majority`,
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

/////////////////////////////////passport//////////////////////////////////////////

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
      callbackURL: "https://localhost:4002/auth/google/secrets",
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
