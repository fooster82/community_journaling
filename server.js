const express = require('express');
const dotenv = require('dotenv').config();
const axios = require('axios');
const cors = require('cors');
const port = (process.env.port || 5000);

const app = express();
app.use(express.json());

const articles = [
    {
        id: 1,
        title: "Winter Support",
        entry: "Worried about keeping warm this winter? You might be eligible for support to get your home more energy efficient. Turning the heating on is a simple step to stay warm, but some of us find it hard to keep our home warm and are faced with high energy bills. If you're struggling and worried about keeping warm this winter, then support can be available.", 
        postComments: [
            {comment: '2021/10/6 - 12:31: Hello welcome to the comments section! Please read the Code of Conduct before posting.', gifs: []},
            {comment: '2021/10/6 - 13:35: Thanks for the advice.', gifs: ['https://media.giphy.com/media/WVjmqI7jPwIUM/giphy.gif']},
            {comment: '2021/10/6 - 13:49: Could you provide more information?', gifs: ['https://media.giphy.com/media/WVjmqI7jPwIUM/giphy.gif']},
            {comment: '2021/10/6 - 14:57: Good to know, thanks.', gifs: ['https://media.giphy.com/media/WVjmqI7jPwIUM/giphy.gif']},
        ], 
        emojis: {like: 1, heart: 5, fire: 3}
    }, 
    {
        id: 2,
        title: "Missing Cat",
        entry: "Hi everyone, our cat Mike has gone missing. Two days ago came in and then went out in the garden! Please if you seen him let us know ! My daughter is missing him so much!", 
        postComments: [
            {comment: '2021/10/6 - 14:21: Hello welcome to the comments section! Please read the Code of Conduct before posting.', gifs: []},
            {comment: '2021/10/6 - 14:38: Sorry to hear, hope you find Mike!', gifs: []},
            {comment: '2021/10/6 - 14:59: I think I might have seen him down the high street.', gifs: []},
            {comment: '2021/10/6 - 15:26: Oh no, hope you find Mike!', gifs: []},
        ], 
        emojis: {like: 2, heart: 7, fire: 0}
    }
]

app.use(cors());
app.listen(port, () =>{
    console.log(`app listening at https://localhost:${port}`)
});

app.get("/", (req, res) => res.send("Welcome to StreetHub"));

// returns all articles
app.get("/articles", (req, res) => res.json({results: articles}));

//returns an article by id 
app.get("/articles/:id", (req, res) => {
    if(req.params.id > articles.length || req.params.id < 0){
        res.status(404).json({
            message : 'Please enter a number greater than 0.'
        });
  } else {
    res.send(articles[req.params.id-1]);
}});

//Get a gif
app.get("/gifs/:query", async (req, res) => {
    try {
        const searchGif = req.params.query;
        const apiKey = process.env.API_KEY;

        const response = await axios.get(`https://api.giphy.com/v1/gifs/search?api_key=n4DfHRcGUm9S4orgEU3le42IOAIKmqqA&q=${searchGif}&limit=10&offset=0&rating=g&lang=en`);
	
		return res.json({
            success: true,
            output: response.data
        });
    } catch(err) {
        return res.status(500).json({
			success: false,
			error_message: err
		});
    }
});

// posts a new article
app.post("/entry", (req, res) => {
    try {
        let newEntry =  { id: articles.length+1, 
        title: req.body.title,
        entry: req.body.entry,
        postComments: req.body.postComments, 
        gifs: req.body.gifs,
        emojis: req.body.emojis };
        articles.push(newEntry);
        res.status(201).json({
            message: "Article added"
        });
    } catch(err) {
        res.status(500).json({
            message: "Error: Article not added"
        });
    }
});

// posts a new comment and attaches it to the article
app.post("/newcomment/:id", (req, res) => {
    try{
        let newComment = req.body.comment;
        let newGifs = req.body.gifs;
        articles[req.params.id].postComments.push({comment: newComment, gifs: newGifs});
        res.status(201).json({
            message: "Comment posted"
        });
    } catch(err) {
        res.status(500).json({
            message: "Error: Comment could not be posted"
        });
    }
});


// Delete an entry
app.delete("/articles/delete/:id" , (req, res) => {
    try {
        if(req.params.id > articles.length || req.params.id < 0){
            res.status(404).json({
                message : 'Please enter a number greater than 0.'
            })        
        } else { 
        delete articles[req.params.id-1];
        res.status(200).json({
            message: "Article deleted",
            success: true
        })}
    } catch(err) {
        res.status(500).json({
            message: "Error: article could not be deleted."
        })
    }
});

//Updates article
app.put("/articles/update/:id" , (req, res) => {
    try {
        if(req.params.id > articles.length || req.params.id < 0){
            res.status(404).json({
                message : 'Please enter a number greater than 0.'
            })                 
        } else {            
            articles[req.params.id-1].entry = req.body.entry;
            articles[req.params.id-1].title = req.body.title;
            res.status(201).json({
                message: "Your post has been updated"
            }) 
        }
    } catch(err) {
        res.status(500).json({
            message: "Your post could not be updated"
        })
    }
})

//Update the emoji counters 
app.put("/emojis/update/:id", (req,res) => {
    try {
        articles[req.params.id].emojis.like = req.body.like;
        articles[req.params.id].emojis.heart = req.body.heart;
        articles[req.params.id].emojis.fire = req.body.fire;        
        res.status(200).json({
            message: "Post emoji-ed"
        })
    } catch(err) {
        res.status(500).json({
                message: "Error: post could not be emoji-ed"
        })
    }
});

module.exports = app;
