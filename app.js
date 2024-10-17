const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');

const app = express();
const port = 3000;

// Use EJS as the template engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory database for simplicity (you could use a real DB)
let posts = [];

// Serve the form and scheduled posts
app.get('/', (req, res) => {
  res.render('index', { posts });
});

// Handle form submission to schedule a post
app.post('/schedule', (req, res) => {
  const { title, body, imageUrl, link, isVideo, dateTime } = req.body;

  // Create a post object
  const post = {
    title,
    body,
    imageUrl,
    link,
    isVideo: isVideo === 'on', // Checkbox returns 'on' if checked
    dateTime,
    sent: false
  };

  // Schedule the post to be sent at the specified time
  const sendDate = new Date(dateTime);
  schedule.scheduleJob(sendDate, () => {
    console.log(`Sending Airship post: ${post.title}`);
    post.sent = true; // Mark post as sent
  });

  // Save the post
  posts.push(post);
  res.redirect('/');
});

// Start the server
app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
