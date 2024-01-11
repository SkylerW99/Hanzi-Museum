    /* old model
    const URL = "https://teachablemachine.withgoogle.com/models/0bDNiGv6F/";
    */

    const URL ='https://teachablemachine.withgoogle.com/models/6GlMsXJls/';

    let model, webcam, labelContainer, maxPredictions;


    //setup webcam w/o tm
    async function setUpWebcam(){
        const video = document.getElementById('webcam');
        const canvas = document.getElementById('canvas');
        if(!canvas) return;

        const context = canvas.getContext('2d');

        //canvas size
        canvas.width = 400;
        canvas.height = 400;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
    
            // Draw the video frame to the canvas
            video.addEventListener('loadedmetadata', () => {
                let sourceX, sourceY, sourceWidth, sourceHeight;

                const videoAR = video.videoWidth / video.videoHeight;
                const canvasAR = canvas.width / canvas.height;

                sourceHeight = video.videoHeight;
                sourceWidth = sourceHeight * canvasAR;
                sourceX = (video.videoWidth - sourceWidth) / 2;
                sourceY = 0;


    
            function drawCanvas() {
                context.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight,0, 0, canvas.width, canvas.height);
                requestAnimationFrame(drawCanvas);
            }
            drawCanvas();
        });
        } catch (error) {
            console.error('Error accessing the webcam', error);
        }
    }

    window.onload = setUpWebcam();

    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = false; // whether to flip the webcam
        webcam = new tmImage.Webcam(500, 500, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
    
        window.requestAnimationFrame(loopFiveSeconds);

        // display webcam result on the canvas
        //document.getElementById("webcam-container").appendChild(webcam.canvas);

    }


    let startTime = null;
    async function loopFiveSeconds(){
        if (!startTime){
            startTime = Date.now();
        }

        webcam.update(); // update the webcam frame
        await predict();


        if (Date.now() - startTime < 10000){
            window.requestAnimationFrame(loopFiveSeconds);
        } else{
            console.log('Stop the loop after 10 seconds.');
            classification();
        }
    }

    function classification(){
        //highest average
        let highestP = 0;
        let classification = "";
        let currentPage = window.location.href.split('/').pop();

        for (let key in ap) {

        //see average probability of all classes
            if (ap.hasOwnProperty(key)) { 
                console.log(`${key}: ${ap[key].average}`);
            }

        //highest average
            if (ap[key].average > highestP) {
                highestP = ap[key].average;
                classification = key;
            }
        }
        console.log(classification);

        //add classification result to DOM //just for debugging delete later
        //let result = document.getElementById("result");
        //result.innerHTML = `Classification Result: ${classification}`;

        //ADD MORE: switch cases & don't forget to add the "blank" case
        if(currentPage === 'waiting1.html'){
        if (classification == 'dai'){
            window.location.href = 'success.html';
        } else {
            window.location.href='fail.html'
        }
        } else if (currentPage === 'waiting2.html'){
        if (classification == "kun"){
            window.location.href = 'words/kun.html';
        } else if (classification == "dai"){
            window.location.href = 'words/dai.html';
        }
        else if (classification == "xing"){
            window.location.href = 'words/xing.html';
        } else if (classification == "kou"){
            window.location.href = 'words/kou.html';
        } else if (classification == "mu"){
            window.location.href = 'words/mu.html';
        } else if (classification == "hui"){
            window.location.href = 'words/hui.html';
        } else if (classification == "lv"){
            window.location.href = 'words/lv.html';
        } else if (classification == "lin"){
            window.location.href = 'words/lin.html';
        } else if (classification == "seng"){
            window.location.href = 'words/sen.html';
        } else if (classification == "ping"){
            window.location.href = 'words/ping.html';
        } else if (classification == "others"){
            snapPhoto();
            //console.log(capturedImageDataUrl);
            window.location.href = "input.html";
        }
    } 
        
    }

    function snapPhoto(){
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        context.drawImage(webcam.canvas,0,0,canvas.width, canvas.height);

        const capturedImageDataUrl = canvas.toDataURL('image/png');

        localStorage.setItem('image',capturedImageDataUrl);
    }
    

    // run the webcam image through the image model
    let ap = {}; //empty object for storing avg val

    async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            const className = prediction[i].className;
            const probability = prediction[i].probability.toFixed(2);

            /*
            const classPrediction =
                className + ": " + probability;
            */    

            //accumulated probability
            if(!ap[className]){
                ap[className] = {total:0, count:0, average:0};
            }
            ap[className].total += parseFloat(probability);
            ap[className].count++;
            ap[className].average = ap[className].total/ap[className].count;
        }
    }



//button events & fetch data
document.addEventListener('DOMContentLoaded', function() {


    const webcamContainer = document.getElementById('webcam-container');
    if (webcamContainer){
        init();
    }

    const form = document.getElementById('form');
    //form submission and fetch data
    if (form){
    form.addEventListener('submit',(e) =>{
        e.preventDefault();
        console.log('Form submission started');


        const formData = {
            name: document.getElementById('user-name').value,
            message: document.getElementById('user-message').value,
        };

        console.log('sending fetch request');

        fetch('/submit-form',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json', 
            },
            body: JSON.stringify(formData),
        })
        .then(response =>{
            if(response.ok){
                return  response.json(); 
            }
            throw new Error('Network reponse was not ok.')
        })
        .then(data =>{
            console.log('Success', data);
            console.log('local storage set, navigating to next page');
            localStorage.setItem('formData',JSON.stringify(formData));
            window.location.href = 'archive.html';
            
        })
        .catch ((error) =>{
            console.error('error',error);
        })
    })
    }


    //start over & play again buttons
    const startOver = document.getElementById('startOver');
    if(startOver){
    startOver.addEventListener('click',()=>{
        window.location.href = '../index.html';
    })
    }

    const toDetection = document.getElementById('toDetection');
    
    if(toDetection){
    toDetection.addEventListener('click',()=>{
        window.location.href = '../assembleNew.html';
    })
    }
})

//carousel image selection
document.addEventListener('DOMContentLoaded', function() {
    let images = ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png'];
    let selectedImages = pickRandomImages(3, images);
    createSlides(selectedImages);
    showSlides(slideIndex);
});

function pickRandomImages(count, imageArray) {
    let selected = new Set();
    while (selected.size < count) {
        let randomIndex = Math.floor(Math.random() * imageArray.length);
        selected.add(imageArray[randomIndex]);
    }
    return Array.from(selected);
}

function createSlides(imageFilenames) {
    const container = document.querySelector('.slideshow-container');
    if(container){
    container.innerHTML += ''; // Clear existing slides if any
    }
    imageFilenames.forEach(filename => {
        let slideDiv = document.createElement('div');
        slideDiv.className = 'mySlides fade';
        slideDiv.innerHTML = `<img src="assets/${filename}" style="width:100%">`;
        container.appendChild(slideDiv);
    });
    /*
    <a class="prev" onclick="plusSlides(-1)">&#10094; Prev</a>
    <a class="next" onclick="plusSlides(1)">&#10095; Next</a>
    */

    showSlides(slideIndex);
}

//image slides
let slideIndex = 1;

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}


//next and prev buttons 
const pages = [
'index.html',
'introMu.html',
'introKou.html',
'assembleDai.html',
'waiting1.html',
'success.html',
'assembleNew.html'
]


function setNavLinks(){
let currentPage = window.location.href.split('/').pop();

if (currentPage === '') {
    currentPage = 'index.html'; // Treat the root URL as 'index.html'
}

const currentIndex = pages.indexOf(currentPage);

const backButton = document.getElementById('backButton');
const nextButton = document.getElementById('nextButton');

if (currentIndex > 0){
    backButton.onclick = () => window.location.href = pages[currentIndex - 1];
} 

if(currentIndex < pages.length - 1 && nextButton){
    nextButton.onclick = () => window.location.href = pages[currentIndex + 1];
}
}

window.onload = setNavLinks;  
    

// Function to get the current page index
function getCurrentPageIndex() {
    let currentPage = window.location.href.split('/').pop();
    
    if (currentPage === '') {
        currentPage = 'index.html';
    }

    return pages.indexOf(currentPage);
}

// Event listener for keydown
document.addEventListener('keydown', function(event) {
    const currentIndex = getCurrentPageIndex();

    if (event.key === 'ArrowRight' && currentIndex < pages.length - 1) {
        window.location.href = pages[currentIndex + 1];
    } else if (event.key === 'ArrowLeft' && currentIndex > 0) {
        window.location.href = pages[currentIndex - 1];
    }
});







