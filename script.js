    const URL = "https://teachablemachine.withgoogle.com/models/0bDNiGv6F/";

    let model, webcam, labelContainer, maxPredictions;

    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = false; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
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
        
        if (classification == "kun"){
            window.location.href = 'words/kun.html';
        } else if (classification == "dai"){
            window.location.href = 'words/dai.html';
        }else if (classification == "xing"){
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
        window.location.href = '../detection.html';
    })
    }



    //display user entry

    /*
    const storedFormData = JSON.parse(localStorage.getItem('formData'));
    const displayName = document.getElementById('displayName');
    const displayMessage = document.getElementById('displayMessage');

    if (storedFormData && displayName && displayMessage){
        displayName.textContent = storedFormData.name;
        displayMessage.textContent = storedFormData.message;
    }
    
    }
    */
})

    

    
    








