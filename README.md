## Certification App
This is a simple Certification Learning Platform built using Node.js, Express, MySQL, 
HTML, CSS, and JavaScript. It enables users to register, watch course videos, attempt
a quiz, and download a certificate upon successful completion.
The application includes session management, quiz scoring, progress tracking, and 
an admin panel for video uploads.
It is designed for students and beginner developers to learn full-stack development with 
practical project experience.
## Features
## User Features:
User Registration and Login
Secure session-based login system for users.
## Video Learning Module
Users must complete watching all videos before accessing the quiz.
Progress is tracked and stored in the database.
## Quiz Functionality
Users can attempt a multiple-choice quiz.
A timer ensures time-bound quiz submission.
Score is stored in the database and results are shown.
## Certificate Generation
Upon scoring 60% or more in the quiz, users can download a PDF certificate.
The certificate is personalized with the user's name and date.
## Technologies Use
Node.js	--Backend runtime
Express	--Server-side routing framework
MySQL	--Relational database
HTML/CSS	--Frontend structure and styling
JavaScript	--Quiz logic and timer
EJS	--Templating engine
PDFKit	--Certificate generation
## Install Dependencies
npm install
## Set Up the Database
CREATE DATABASE certificate_app;
USE certificate_app;


CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  has_certificate BOOLEAN DEFAULT 0,
  quiz_attempted BOOLEAN DEFAULT 0
);

CREATE TABLE videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  video_name VARCHAR(255) NOT NULL,
  description TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed BOOLEAN DEFAULT FALSE
);

CREATE TABLE quiz_results (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  score INT,
  attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
## Configure MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_mysql_password",
  database: "certificate_app"
});
## Run the Server
node server.js
Server will run at http://localhost:3000
