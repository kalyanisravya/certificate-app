const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const mysql = require("mysql2");
const app = express();
const db = require('./db');
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); 
app.use("/videos", express.static(__dirname + "/public/videos"));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", (req, res) => res.render("index"));

app.get("/register", (req, res) => res.render("register"));
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    (err) => {
      if (err) return res.send("User already exists.");
      res.redirect("/login");
    }
  );
});

app.get("/login", (req, res) => res.render("login"));
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (results.length > 0) {
        req.session.user = results[0];
        res.redirect("/dashboard");
      } else {
        res.send("Invalid credentials");
      }
    }
  );
});




app.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const videos = [
    "sample1.mp4",
    "sample2.mp4",
    "sample3.mp4",
    "sample4.mp4",
    "sample5.mp4",
    "sample6.mp4",
    "sample7.mp4"
  ];

  db.query(
    "SELECT video_name FROM video_progress WHERE user_id = ? AND completed = 1",
    [req.session.user.id],
    (err, results) => {
      if (err) return res.send("Database error.");

      const completed = results.map(v => v.video_name);
      const allCompleted = videos.every(v => completed.includes(v));

      res.render("dashboard", {
        user: req.session.user,
        videos,
        completed,
        allCompleted
      });
    }
  );
});
app.get("/quiz", (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const videos = [
    "sample1.mp4",
    "sample2.mp4",
    "sample3.mp4",
    "sample4.mp4",
    "sample5.mp4",
    "sample6.mp4",
    "sample7.mp4"
  ];

  db.query(
    "SELECT video_name FROM video_progress WHERE user_id = ? AND completed = 1",
    [req.session.user.id],
    (err, results) => {
      if (err) return res.send("Database error.");

      const completed = results.map(v => v.video_name);
      const allCompleted = videos.every(v => completed.includes(v));

      if (!allCompleted) {
        return res.send("❗ Complete all videos to take the test.");
      }

      const quiz = [
        {
          question: " What does AI stand for?",
          options: ["Artificial Insight", "Automated Interface", "Artificial Intelligence", "Automated Intelligence"],
          answer: "Artificial Intelligence"
        },
        {
          question: " Which of the following is a branch of Artificial Intelligence?",
          options: ["Machine Learning", "Data Entry", "Web Development", "Cloud Computing"],
          answer: "Machine Learning"
        },
        {
          question: " Who is known as the father of AI?",
          options: ["Elon Musk", "Alan Turing", "John McCarthy", "Bill Gates"],
          answer: "John McCarthy"
        },
        {
          question: " Which programming language is most commonly used for AI?",
          options: ["HTML", "Python", "PHP", "SQL"],
          answer: "Python"
        },
        {
          question: " What is the goal of Artificial Intelligence?",
          options: ["To replace humans", "To create web applications", "To make systems intelligent", "To store data"],
          answer: "To make systems intelligent"
        },
        {
          question: " Which of the following is NOT a type of AI?",
          options: ["Weak AI", "General AI", "Super AI", "Tiny AI"],
          answer: "Tiny AI"
        },
        {
          question: " Which AI technique enables a computer to learn from data?",
          options: ["Data Mining", "Machine Learning", "SQL", "Internet Browsing"],
          answer: "Machine Learning"
        },
        {
          question: " What is NLP in AI?",
          options: ["Natural Logic Processing", "Non-Logical Programming", "Natural Language Processing", "Neural Language Protocol"],
          answer: "Natural Language Processing"
        },
        {
          question: " Which of the following is an example of AI in daily life?",
          options: ["Microwave", "Calculator", "Google Assistant", "Television"],
          answer: "Google Assistant"
        },
        {
          question: " What is an artificial neural network inspired by?",
          options: ["Internet cables", "Human brain", "Solar system", "Programming syntax"],
          answer: "Human brain"
        },
        {
    question: " What is one of the main benefits of using AI in industries?",
    options: ["Slower decision-making", "Increased human errors", "Automation of repetitive tasks", "Decreased efficiency"],
    answer: "Automation of repetitive tasks"
  },
  {
    question: " How does AI help in improving productivity?",
    options: ["By reducing work hours only", "By replacing managers", "By handling routine and repetitive tasks", "By hiring more workers"],
    answer: "By handling routine and repetitive tasks"
  },
  {
    question: " Which of the following is a key benefit of AI in healthcare?",
    options: ["Manual record keeping", "Predictive diagnosis and treatment suggestions", "Longer waiting times", "Increasing paperwork"],
    answer: "Predictive diagnosis and treatment suggestions"
  },
  {
    question: " What is a major benefit of AI in customer service?",
    options: ["Less communication", "Slower response time", "24/7 availability through chatbots", "Increased need for manual replies"],
    answer: "24/7 availability through chatbots"
  },
  {
    question: "Which benefit of AI helps in data analysis?",
    options: ["Guessing based on human intuition", "Random sampling", "Fast and accurate pattern recognition", "Delaying reports"],
    answer: "Fast and accurate pattern recognition"
  }
      ];

      res.render("quiz", { quiz });
    }
  );
});



app.post("/submit-quiz", (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const userId = req.session.user.id;

  db.query("SELECT quiz_attempted FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) return res.send("Database error on checking attempt.");
    if (result[0].quiz_attempted) {
      return res.send("<h2>❌ You have already attempted the quiz.</h2><a href='/dashboard'>Go Back</a>");
    }

    const userAnswers = req.body;
    const total = parseInt(userAnswers.total);
    let score = 0;

    const quiz = [ 
      { question: "What does AI stand for?", answer: "Artificial Intelligence" },
      { question: "Which of the following is a branch of Artificial Intelligence?", answer: "Machine Learning" },
      { question: "Who is known as the father of AI?", answer: "John McCarthy" },
      { question: "Which programming language is most commonly used for AI?", answer: "Python" },
      { question: "What is the goal of Artificial Intelligence?", answer: "To make systems intelligent" },
      { question: "Which of the following is NOT a type of AI?", answer: "Tiny AI" },
      { question: "Which AI technique enables a computer to learn from data?", answer: "Machine Learning" },
      { question: "What is NLP in AI?", answer: "Natural Language Processing" },
      { question: "Which of the following is an example of AI in daily life?", answer: "Google Assistant" },
      { question: "What is an artificial neural network inspired by?", answer: "Human brain" },
      { question: "What is one of the main benefits of using AI in industries?", answer: "Automation of repetitive tasks" },
      { question: "How does AI help in improving productivity?", answer: "By handling routine and repetitive tasks" },
      { question: "Which of the following is a key benefit of AI in healthcare?", answer: "Predictive diagnosis and treatment suggestions" },
      { question: "What is a major benefit of AI in customer service?", answer: "24/7 availability through chatbots" },
      { question: "Which benefit of AI helps in data analysis?", answer: "Fast and accurate pattern recognition" }
    ];

    for (let i = 0; i < total; i++) {
      if (userAnswers[`q${i}`] === quiz[i].answer) {
        score++;
      }
    }

    const percentage = total > 0 ? (score / total) * 100 : 0;
    db.query(
      "INSERT INTO quiz_results (user_id, score) VALUES (?, ?) ON DUPLICATE KEY UPDATE score = VALUES(score), attempted_at = CURRENT_TIMESTAMP",
      [userId, percentage],
      (err) => {
        if (err) return res.send("Error saving result");
        const updateQuery = percentage >= 80
          ? "UPDATE users SET has_certificate = 1, quiz_attempted = 1 WHERE id = ?"
          : "UPDATE users SET quiz_attempted = 1 WHERE id = ?";

        db.query(updateQuery, [userId], (err) => {
          if (err) return res.send("❌ Error updating user quiz status.");

          if (percentage >= 80) {
            res.send(`<h2>🎉 You passed! Score: ${percentage.toFixed(2)}%</h2><a href="/certificate">Download Certificate</a>`);
          } else {
            res.send(`<h2>❌ You failed. Score: ${percentage.toFixed(2)}%</h2><a href="/dashboard">Try Again</a>`);
          }
        });
      }
    );
  });
});


app.get("/certificate", (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  db.query("SELECT * FROM users WHERE id = ?", [req.session.user.id], (err, result) => {
    if (result[0].has_certificate) {
      res.render("certificate", { user: result[0] });
    } else {
      res.send("You haven't earned the certificate yet.");
    }
  });
});

app.post("/complete", (req, res) => {
  if (!req.session.user) return res.status(401).send("Not logged in");

  const { video } = req.body;
  const userId = req.session.user.id;

  db.query(
    "INSERT INTO video_progress (user_id, video_name, completed) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE completed = 1",
    [userId, video],
    (err) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).send("Database error");
      }
      res.redirect("/dashboard");

    }
  );
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
