    const URL = "https://teachablemachine.withgoogle.com/models/eL3opRC4o/";

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
        document.getElementById("webcam-container").appendChild(webcam.canvas);

    }


    let startTime = null;
    async function loopFiveSeconds(){
        if (!startTime){
            startTime = Date.now();
        }

        webcam.update(); // update the webcam frame
        await predict();


        if (Date.now() - startTime < 5000){
            window.requestAnimationFrame(loopFiveSeconds);
        } else{
            console.log('Stop the loop after 5 seconds.');
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

        //add classification result to DOM
        let result = document.getElementById("result");
        result.innerHTML = `Classification Result: ${classification}`;

        //ADD MORE: switch cases
        if (classification == "kun"){
            window.location.href = 'words/kun.html';
        } else if (classification == "xing"){
            window.location.href = 'words/xing.html';
        } else if (classification == "others"){
            window.location.href = "input.html";
        }
    
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


//button events
document.addEventListener('DOMContentLoaded', function() {
    const toIntro = document.getElementById('toIntro');
    if (toIntro){
        toIntro.addEventListener('click', function() {
        window.location.href = 'intro.html';
    });
    }

    const toIntro2 = document.getElementById('toIntro2');
    if (toIntro2){
        toIntro2.addEventListener('click', function() {
        window.location.href = 'intro2.html';
    });
    }

    const toDetection = document.getElementById('toDetection');
    if (toDetection){
        toDetection.addEventListener('click', function() {
        window.location.href = 'detection.html';
    });
    }

    const toWaiting = document.getElementById('toWaiting');
    if (toWaiting){
        toWaiting.addEventListener('click', function() {
        window.location.href = 'waiting.html';
    }
)}

    const webcamContainer = document.getElementById('webcam-container');
    if (webcamContainer){
        init();
    }

    //form submission
    const form = document.getElementById('form');
    if (form){
    form.addEventListener('submit',(e) =>{
        e.preventDefault();

        const formData = {
            name: document.getElementById('user-name').value,
            message: document.getElementById('user-message').value
        };

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
            localStorage.setItem('formData',JSON.stringify(formData));
            //go to next page
            window.location.href = 'archive.html';
        })
        .catch ((error) =>{
            console.error('error',error);
        })
    })
    }


    })

    

    
    








