//// Navbar JS
window.onscroll = () => windowScroll();

const windowScroll = () => {
    let nav = document.querySelector('nav')
    let navLogo = document.getElementById('navLogo');
    let navPostButton = document.getElementById('newPostButton');

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

// When the user clicks the 'Comments' button, open the comments modal
for (let i = 0; i < commentsBtn.length; i++) {
    commentsBtn[i].onclick = function(e) {
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

// Functionality for New Post button
const postBtn = document.getElementById('newPostButton')
const newPost = document.getElementById('newPost');
const closePost = document.getElementById('closepostBtn')

// Functions
function openPostModal() {
    newPost.style.display = 'block';
}

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

let searchGif = document.getElementById('searchGif');
let gifQuery = document.getElementById('gifSearchQuery');
let gifResults = document.getElementById('gifResults');
searchGif.addEventListener('click', e => {
    e.preventDefault();
    while(gifResults.firstChild){
        gifResults.firstChild.remove();
    }
    getGiphy(gifQuery.value).then(resultList => {
        for(item of resultList){
            let newGif = document.createElement('div');
            newGif.innerHTML = `<button style="background: url('${item}')" value="${item}" type="button" class="gifResult" onclick="chosenGifs.push('${item}')">`;
            gifResults.appendChild(newGif);

        }
    })   
});

let clearGifs = document.getElementById('clearGifs');
clearGifs.addEventListener('click', e => {
    while(gifResults.firstChild){
        gifResults.firstChild.remove();
    }
})

let removeGif = document.getElementById('removeGif');
removeGif.addEventListener('click', e => {
    chosenGifs = [];
    alert('Selected GIFs removed.');
});

let comments = [
    {comment:'Very good', gifs: ['https://media.giphy.com/media/Ju7l5y9osyymQ/giphy.gif']}, 
    {comment:'Great post', gifs: []}, 
    {comment:'I agree', gifs: ['https://media.giphy.com/media/WVjmqI7jPwIUM/giphy.gif']},
    {comment:`This is the best thing I've ever read`, gifs: []},
    {comment:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', gifs: []}

const getArticles = () => {
    let articles = [];
    fetch('http://localhost:5000/articles')
    .then(response => response.json())
    // let ressies = response.json
    .then(data => {
        console.log(data)
        articles.push(data)
        console.log(articles);
    });
};

let inputBox = document.getElementById('postInputBox');
let submitBtn = document.getElementById('postBtn');
submitBtn.addEventListener('click', e => {
    e.preventDefault();
    let results = [];
    getArticles()
    // .then(result => result.json)
    // console.log(result)
    // .then(data => console.log(data))
    // results.push(data);
    // console.log(results)
})

];
let viewComments = document.getElementById('viewComments');
let commentsList = document.getElementById('commentsList');
viewComments.addEventListener('click', e => {
    while(commentsList.firstChild){
        commentsList.firstChild.remove();
    }
    for(comment in comments){
        let commentTitle = document.createElement('dt');
        let commentDesc = document.createElement('dd');
        commentTitle.textContent = 'Anonymous';
        commentDesc.textContent = comments[comment].comment;
        if(comments[comment].gifs){
            for(gifItem in comments[comment].gifs){
                let commentGif = document.createElement('img');
                commentGif.src = comments[comment].gifs[gifItem];
                commentsList.insertAdjacentElement('afterbegin', commentGif);
            } 
        }
        commentsList.insertAdjacentElement('afterbegin', commentDesc);
        commentsList.insertAdjacentElement('afterbegin', commentTitle);
    }
});

let submitComment = document.getElementById('commentsForm');
submitComment.addEventListener('submit', e => {
    e.preventDefault();
    alert('Comment Submitted');
    comments.push({comment: submitComment.comments.value, gifs: chosenGifs || []});
    chosenGifs = [];
})

function closePostModal() {
    newPost.style.display = 'none';
}

function outsidePostClick(e) {
    if(e.target == newPost){
        newPost.style.display = 'none';
    }
}

// Listens for clicks
postBtn.addEventListener('click', openPostModal);
closePostBtn.addEventListener('click', closePostModal);
window.addEventListener('click', outsidePostClick);



//// Emoji counter
//Selectors
const likeBtn = document.getElementById('likeEmoji');
const heartBtn = document.getElementById('heartEmoji');
const fireBtn = document.getElementById('fireEmoji');

//Event listener to change button style when clicked and alter the coutner

// Sets the coutners intialy to zero and adds them to the html
let likeCount = 7;
let heartCount = 3;
let fireCount = 5;

const likeCounter = document.getElementById('likeCounter');
const heartCounter = document.getElementById('heartCounter');
const fireCounter = document.getElementById('fireCounter');

window.addEventListener('load', () => {
    likeCounter.textContent = likeCount;
    heartCounter.textContent = heartCount;
    fireCounter.textContent = fireCount;
})


// Like button
likeBtn.addEventListener('click', () => {
    if(likeBtn.style.backgroundColor === 'white') {
        likeBtn.style.backgroundColor = 'rgb(41,114,250)';
        likeBtn.style.border = 'black';
        likeBtn.style.fontWeight = 'bolder';
        likeCount ++;
        likeCounter.textContent = likeCount;
    } else {
        likeBtn.style.backgroundColor = 'white';
        likeBtn.style.border = 'white';
        likeBtn.style.fontWeight = 'normal';
        likeCount --;
        likeCounter.textContent = likeCount
    }
});

// Love button
heartBtn.addEventListener('click', () => {
    if(heartBtn.style.backgroundColor === 'white') {
        heartBtn.style.backgroundColor = 'rgb(211,105,116)';
        heartBtn.style.border = 'black';
        heartBtn.style.fontWeight = 'bolder';
        heartCount++;
        heartCounter.textContent = heartCount;
    } else {
        heartBtn.style.backgroundColor = 'white';
        heartBtn.style.border = 'white';
        heartBtn.style.fontWeight = 'normal'
        heartCount--;
        heartCounter.textContent = heartCount
    }
});

// Fire button
fireBtn.addEventListener('click', () => {
    if(fireBtn.style.backgroundColor === 'white') {
        fireBtn.style.backgroundColor = 'rgb(250,182,51)';
        fireBtn.style.border = 'black';
        fireBtn.style.fontWeight = 'bolder';
        fireCount++;
        fireCounter.textContent = fireCount;
    } else {
         fireBtn.style.backgroundColor = 'white';
         fireBtn.style.border = 'white';
         fireBtn.style.fontWeight = 'normal'
         fireCount--;
         fireCounter.textContent = fireCount
    }
});
















////////////////////////////////////////
// Original code for modal event listeners saved for referance / in case of drastic failure :O

// // Get required elements
// const modal = document.getElementsByClassName("ourModal")[0];
// const readModalBtn = document.getElementsByClassName("readBtn")[0];
// const closeBtn = document.getElementsByClassName("closeBtn")[0];

// console.log(modal);
// console.log(readModalBtn);
// console.log(closeBtn);

// // Listen for open and close click
// readModalBtn.addEventListener('click', openModal);
// closeBtn.addEventListener('click', closeModal);

// //Listen for outside click
// window.addEventListener('click', outsideClick);

// //Functions to open and close modal
// function openModal() {
//     modal.style.display = 'block';
//     console.log('modal opened');
// }

// function closeModal() {
//     modal.style.display = 'none';
//     console.log('modal closed');
// }

// //Function to close modal if outside click
// function outsideClick(e) {
//     if(e.target == modal){
//         modal.style.display = 'none';
//         console.log('outside click = modal closed');
//     }
// }