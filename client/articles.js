//// Navbar JS
window.onscroll = () => windowScroll();

const windowScroll = () => {
    let nav = document.querySelector('nav')
    let navLogo = document.getElementById('navLogo');
    let navPostButton = document.getElementById('newPostButton');

    //Distance from the top of the page
    if (document.documentElement.scrollTop > 80) {
        navLogo.src = 'assets/updated logo/logo_small_icon_only_inverted.png';
        navLogo.style.height = '50px';
        nav.style.height = '75px';
        navLogo.style.top = '12px';
        navLogo.style.left = '70px';
        navPostButton.style.top = '15px';
        nav.style.transition = 'height 0.2s'

    } else {
        navLogo.src = './assets/updated logo/logo_small.png';
        navLogo.style.height = '80px';
        nav.style.height = '100px';
        navLogo.style.top = '10px';
        navLogo.style.left = '40px';
        navPostButton.style.top = '30px';
        nav.style.transition = 'height 0.2s'
    }
}

//// Functionality for the article modals 
// Store the required arrays
const modals = document.getElementsByClassName('ourModal');
const readBtn = document.querySelectorAll('button.readBtn');
const commentsBtn = document.querySelectorAll('button.commentBtn');
const closeBtn = document.getElementsByClassName('closeBtn');

// When the user clicks the 'Read' button, open the article modal
for (let i = 0; i < readBtn.length; i++) {
    readBtn[i].onclick = function(e) {
       e.preventDefault();
       let modal = document.querySelector(e.target.getAttribute("href"));
       modal.style.display = "block";
    }
}

// When the user clicks on (x), close the modal
for (let i = 0; i < closeBtn.length; i++) {
    closeBtn[i].onclick = function() {
    for (let index in modals) {
        if (typeof modals[index].style !== 'undefined') modals[index].style.display = "none";    
        }
    }
}
   
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target.classList.contains('ourModal')) {
    for (let index in modals) {
        if (typeof modals[index].style !== 'undefined') modals[index].style.display = "none";    
        }
    }
}

//Client fetch from server Giphy fetch route
const getGiphy = async(query) => {
    let gifs = [];
    try {
        let response =  await fetch(`http://localhost:5000/gifs/${query}`)
        let jsonResponse = await response.json();
        
        for(result in jsonResponse.output.data){
            gifs.push(jsonResponse.output.data[result].images.downsized.url);
        } 
        
        return gifs;
    } catch(error) {
        console.error("There was an error handling your request: " + error.message);
    } 
};

let chosenGifs = [];

//Post each comment to the server with the right article id
const postComments = async (newComment, newGifs, item) => {
    let today = new Date();
    let curDate = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
    let curTime = today.getHours() + ":" + today.getMinutes();
    try {
        await fetch(`http://localhost:5000/newcomment/${item}`, {
        method: "POST",
        body: JSON.stringify({comment: `${curDate} - ${curTime}: ${newComment}`, gifs: newGifs}),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
    } catch(err) {
        console.log(err);
    }
}

//Lets a user retrieve and submit GIFs from Giphy
const commentDisplay = (commentsIdVal) => {  
    let searchGif = document.getElementById('searchGif');
    let gifQuery = document.getElementById('gifSearchQuery');
    let gifResults = document.getElementById('gifResults');
    let submitComment = document.getElementById('commentsForm');

    searchGif.addEventListener('click', e => {
        e.preventDefault();
        //Clears exisitng displayed GIFs on the modal
        while(gifResults.firstChild){
            gifResults.firstChild.remove();
        }
        //Calls Giphy retrieval function with query
        getGiphy(gifQuery.value).then(resultList => {
            for(item of resultList){
                let newGif = document.createElement('div');
                newGif.innerHTML = `<button style="background: url('${item}')" value="${item}" type="button" class="gifResult" onclick="chosenGifs.push('${item}'); alert('GIF Added')">`;
                gifResults.appendChild(newGif);
                
            }
        })   
    });
    
    //Remove displayed GIFs on the modal
    let clearGifs = document.getElementById('clearGifs');
    clearGifs.addEventListener('click', e => {
        while(gifResults.firstChild){
            gifResults.firstChild.remove();
        }
    })
    
    //Deletes a user's selected GIFs
    let removeGif = document.getElementById('removeGif');
    removeGif.addEventListener('click', e => {
        chosenGifs = [];
        alert('Selected GIFs removed.');
    });

    //Posts the user's comments and selected GIFs to the server
    submitComment.addEventListener('submit', e => {
        e.preventDefault();
        try {
            postComments(submitComment.comments.value, chosenGifs || [], commentsIdVal);
            alert('Comment Submitted');
            chosenGifs = [];
            location.reload();
        } catch(err) {
            console.log(err);
        }
    });
}

//Displays the modal with the article information
const showModal = (data) => {
    let seeMore = document.getElementById(`viewPost${item}`);
    seeMore.addEventListener('click', e => {
        let modalTitle = document.getElementById('modalTitle');
        modalTitle.textContent = data.title;
        articleContent.textContent = data.entry;   
        viewModal.style.display = 'block';
        let commentsData = data.postComments;
        let commentsId = seeMore.getAttribute('data-value');
        commentDisplay(commentsId, commentsData);
    });
}

let resultVal;

// Functionality for New Post button

const postButton = document.getElementById('newPostButton')


const newPost = document.getElementById('newPost');
const closePost = document.getElementById('closepostBtn')
const getArticles = () => {
    let articles = [];
    fetch('http://localhost:5000/articles')
    .then(response => response.json())
    .then(data => {
        articles.push(data)
        //display articles into boxes 
        for (item in data.results){
            console.log(data.results[item]);
            let likeCount = data.results[item].emojis.like;
            let heartCount = data.results[item].emojis.heart;
            let fireCount = data.results[item].emojis.fire;        

            let displayArticle = document.createElement('div')
            let articleBody = document.getElementById('article-body')
            //Create and display article on the page
            displayArticle.innerHTML= 

                `<div class="card" id="box1">
                    <header><h3>${data.results[item].title}</h3></header>
                    <p class="articleContent">${data.results[item].entry}</p>
                    <button class="commentBtn btn-link" id="viewPost${item}" data-value="${item}">Leave Comment</button>
                    <button id="commentsShow${item}" class="commentBtn btn-info mt-2 showComments" type="button">Show ${data.results[item].postComments.length} Comments</button>
                    <button id="commentsHide${item}" class="btn-primary mt-2 hideComments" type="button">Hide Comments</button>
                    <dl id="commentsList${item}"></dl>
                    <section id="emojiButtons${item}">     
                        <div id="formBtnContainer" class="btn-group">
                        <button class="btn likeEmoji" style="background-color: white;">Likes: <span id='likeCounter${item}' data-value="${item}">${likeCount}</span><img src="./assets/like.png"></button>
                        <button class="btn heartEmoji" style="background-color: white;">Loves: <span id='heartCounter${item}' data-value="${item}">${heartCount}</span><img src="./assets/heart.png"></button>
                        <button class="btn fireEmoji" style="background-color: white;">Fire: <span id="fireCounter${item}" data-value="${item}">${fireCount}</span><img src="./assets/fire.png"></button>
                        </div>
                    </section>
                </div>`

            articleBody.append(displayArticle);

            let foundComments = data.results[item].postComments
            let viewComments = document.getElementById(`commentsShow${item}`);
            let hideComments = document.getElementById(`commentsHide${item}`);
            let commentsList = document.getElementById(`commentsList${item}`);
            let emojiButtons = document.getElementById(`emojiButtons${item}`);
            
            commentsList.style.display = "none";
            hideComments.style.display = "none";
            viewComments.style.display = "inline";
            emojiButtons.style.display = "inline";

            for(commentText of foundComments){
                let commentTitle = document.createElement('dt');
                let commentDesc = document.createElement('dd');
                commentTitle.textContent = 'Anonymous';
                commentDesc.textContent = commentText.comment;
                if(commentText.gifs){
                    for(gifItem in commentText.gifs){
                        let commentGif = document.createElement('img');
                        commentGif.src = commentText.gifs[gifItem];
                        commentsList.insertAdjacentElement('afterbegin', commentGif);
                    } 
                }
                commentsList.insertAdjacentElement('afterbegin', commentDesc);
                commentsList.insertAdjacentElement('afterbegin', commentTitle);
                commentTitle.style.borderTop = "2px solid purple"
            }

            viewComments.addEventListener('click', e => {
                commentsList.style.display = "block";
                hideComments.style.display = "inline";
                viewComments.style.display = "none"
            });

            hideComments.addEventListener('click', e => {
                commentsList.style.display = "none";
                hideComments.style.display = "none";
                viewComments.style.display = "inline";
            });
            
            resultVal = data.results[item];
            showModal(resultVal);  
            
            // Functions
            //// Emoji counter
                
            //Selectors
            const likeBtn = displayArticle.querySelectorAll('.likeEmoji');
            const heartBtn = displayArticle.querySelectorAll('.heartEmoji');
            const fireBtn = displayArticle.querySelectorAll('.fireEmoji');                                       
                      

            let likeCounter = document.getElementById(`likeCounter${item}`);
            let heartCounter = document.getElementById(`heartCounter${item}`);
            let fireCounter = document.getElementById(`fireCounter${item}`);
            
            // Like button
            likeBtn.forEach(likebutton => likebutton.addEventListener('click', (e) => {
                if(likebutton.style.backgroundColor === 'white') {
                    likebutton.style.backgroundColor = 'rgb(41,114,250)';
                    likebutton.style.border = 'black';
                    likebutton.style.fontWeight = 'bolder';
                    likeCount ++;
                    console.log(likeCount)
                    likeCounter.textContent = likeCount;
                    addEmoji(likeCounter.getAttribute("data-value"));

                } else {
                    likebutton.style.backgroundColor = 'white';
                    likebutton.style.border = 'white';
                    likebutton.style.fontWeight = 'normal';
                    likeCount --;
                    likeCounter.textContent = likeCount;
                    addEmoji(fireCounter.getAttribute("data-value"));
                }
            }));
            
            // Heart button
            heartBtn.forEach(heartbutton => heartbutton.addEventListener('click', (e) => {
                if(heartbutton.style.backgroundColor === 'white') {
                    heartbutton.style.backgroundColor = 'rgb(211,105,116)';
                    heartbutton.style.border = 'black';
                    heartbutton.style.fontWeight = 'bolder';
                    heartCount++;
                    heartCounter.textContent = heartCount; 
                    addEmoji(heartCounter.getAttribute("data-value"));                           
                } else {
                    heartbutton.style.backgroundColor = 'white';
                    heartbutton.style.border = 'white';
                    heartbutton.style.fontWeight = 'normal'
                    heartCount--;
                    heartCounter.textContent = heartCount;
                    addEmoji(fireCounter.getAttribute("data-value"));
                }
            }));
            
            // Fire button
            fireBtn.forEach(firebutton => firebutton.addEventListener('click', (e) => {
                if(firebutton.style.backgroundColor === 'white') {
                    firebutton.style.backgroundColor = 'rgb(250,182,51)';
                    firebutton.style.border = 'black';
                    firebutton.style.fontWeight = 'bolder';
                    fireCount++;
                    fireCounter.textContent = fireCount;
                    addEmoji(fireCounter.getAttribute("data-value"));

                } else {
                    firebutton.style.backgroundColor = 'white';
                    firebutton.style.border = 'white';
                    firebutton.style.fontWeight = 'normal'
                    fireCount--;
                    fireCounter.textContent = fireCount;
                    addEmoji(fireCounter.getAttribute("data-value"));
                }
            }));
    

                                

            const addEmoji = async (index) => {
                try {
                    await fetch(`http://localhost:5000/emojis/update/${index}`, {
                        method: "PUT",
                        body: JSON.stringify({like: likeCount, heart: heartCount, fire: fireCount}),
                        headers: {"Content-type": "application/json; charset=UTF-8"}
                    })
                } catch(err) {
                    console.log("Error: " + err)
                }
            }
        }
    })
}
                
// change listener to be a display artidcles
let inputBox = document.getElementById('postInputBox');
let submitBtn = document.getElementById('postBtn');
window.addEventListener('load', e => {
    e.preventDefault();
    let results = [];
    getArticles()
})

function closePostModal() {
    newPost.style.display = 'none';
}

function openPostModal() {
    newPost.style.display = 'block';
}

function outsidePostClick(e) {
    if(e.target == newPost){
        newPost.style.display = 'none';
    }
}

// Listens for clicks
postButton.addEventListener('click', openPostModal);
closePostBtn.addEventListener('click', closePostModal);
window.addEventListener('click', outsidePostClick);



let articleInput = document.getElementById('postInputBox')
let articleSubmit = document.getElementById('postBtn')
let titleInput = document.getElementById('titleInput')
let articleForm = document.getElementById('postFooter')
let newEntry = articleInput.value

const postArticle = async (newEntry) => {
    // e.preventDefault();
    try {
        await fetch('http://localhost:5000/entry', {
            method: "POST",
            body: JSON.stringify({entry: articleInput.value, title: titleInput.value, postComments: [{comment: "Hello welcome to the comments section! Please read the Code of Conduct before posting."}], emojis: {like: 0, heart: 0, fire: 0}}),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        console.log(articleInput.value)
    } catch(err) {
        console.log("Error: " + err)
    }
}

articleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    postArticle(articleInput.value)
    articleForm.reset();
    window.alert('Your post has been submitted')
    closePostModal();
    location.reload();
});

//module.exports = { openPostModal }