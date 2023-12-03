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

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
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
            if (ap[key].average > highestP) {
                highestP = ap[key].average;
                classification = key;
            }
        }
        console.log(classification);

        //switch case
        /*
        if (classification == "kun"){
            //go to kun's page
        }
        */
    
    }


    
        /*
        const highestAverage = ()=>{
        for (let i=0; i< ap.)
        const sortedPrediction = ap[i].average.sort((a,b) => -a.probability + b.probability);

    /*
    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();

        //reuqest animation frame run again to form a loop
        window.requestAnimationFrame(loop);
    }
    */

    // run the webcam image through the image model
    let ap = {};

    async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            const className = prediction[i].className;
            const probability = prediction[i].probability.toFixed(2);
            const classPrediction =
                className + ": " + probability;
            labelContainer.childNodes[i].innerHTML = classPrediction;

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
})

    
    








