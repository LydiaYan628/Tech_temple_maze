// ml5.js: Pose Classification
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/Courses/ml5-beginners-guide/7.2-pose-classification.html
// https://youtu.be/FYgYyq-xqAw

// All code: https://editor.p5js.org/codingtrain/sketches/JoZl-QRPK

// Separated into three sketches
// 1: Data Collection: https://editor.p5js.org/codingtrain/sketches/kTM0Gm-1q
// 2: Model Training: https://editor.p5js.org/codingtrain/sketches/-Ywq20rM9
// 3: Model Deployment: https://editor.p5js.org/codingtrain/sketches/c5sDNr8eM

//snapshots;
var button;
var snapshots = [];

let poses = [];
let pupil = 0;
let img = [];
let guan = 0;
let hide = 0;

let video;
let poseNet;
let pose;
let skeleton;

let brain;
let poseLabel = "N";

let scenes = [];
let track = 0;
//let dictionary = { 0: "A", 1: "Y", 2: "C", 3: "Y", 4: "M" };

////for 04MainEntrance
let classifier;//soundClap
let soundModel = 'https://teachablemachine.withgoogle.com/models/pXZta-cyC/';
let label="listening...";

////for 05Mainroom
let leftWristAnkleDist;
let rightWristAnkleDist;

////for 07Exit
let soundClassifier;
let said;

function preload() {
  img[0] = loadImage("images/01Entrance.png");
  img[1] = loadImage("images/02TurnLeft.png");
  img[2] = loadImage("images/03TurnRight.png");
  img[3] = loadImage("images/04MainRoomEntrance.png");
  img[4] = loadImage("images/05main.png");
  img[5] = loadImage("images/06gallery.png");
  img[6] = loadImage("images/06gallery.png");
  img[7] = loadImage("images/07exit.png");
  img[8] = loadImage("images/scene1.png");
  // Load the model for 04MainEntrance
  classifier = ml5.soundClassifier(soundModel + 'model.json');
  let soundOptions = { probabilityThreshold: 0.95 };
  soundClassifier = ml5.soundClassifier("SpeechCommands18w", soundOptions);

}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);

  // soundClassifier.removeListener();

  let options = {
    inputs: 34,
    outputs: 4,
    task: "classification",
    debug: true,
  };
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
    model: "model/model.json",
    metadata: "model/model_meta.json",
    weights: "model/model.weights.bin",
  };
  brain.load(modelInfo, brainLoaded);

  //for 07Exit
  // if(track==6){
  //   let soundOptions = { probabilityThreshold: 0.95 };
  //   soundClassifier = ml5.soundClassifier("SpeechCommands18w", soundOptions);
  // }


}

function brainLoaded() {
  console.log("pose classification ready!");
  classifyPose();
}

function classifyPose() {
  console.log("classifyPoseCalled");
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    if (track == 1){
    brain.classify(inputs, gotResult1);
    }else if (track == 2){
    brain.classify(inputs, gotResult2);
    }else if (track == 3){
    brain.classify(inputs, gotResult3);
    }else if (track == 6){
    brain.classify(inputs, gotResult5);
    }else if( track > 3) {
      console.log("not getting pose result")
    }
  } else {
      setTimeout(classifyPose, 100);
  }
}

//turn left
function gotResult1(error, results) {
  console.log("gotResult1");
  console.log("L",results[0].confidence);
  if (results[0].confidence > 0.95) {
    poseLabel = results[0].label.toUpperCase();
    if (poseLabel == "L") {
      console.log("true");
      //delayTime(3000);
      setTimeout(function () {
          track = 2;
      }, 1000);

      // stop listening to pose detection events by removing the event listener
      //poseNet.removeListener('pose', callback);
    }
    console.log(track);
  }
  //console.log(results[0].confidence);
  classifyPose();
}

//turn right
function gotResult2(error, results) {
  console.log("R",results[0].confidence);
  console.log("gotResult2");
  if (results[0].confidence > 0.95) {
    poseLabel = results[0].label.toUpperCase();
    //console.log(dictionary[track]);
    if (poseLabel == "R") {
      console.log("true");
      //delayTime(3000);
      setTimeout(function () {
          track = 3;
      }, 3000);

      // stop listening to pose detection events by removing the event listener
      //poseNet.removeListener('pose', callback);
    }
    console.log(track);
  }
  //console.log(results[0].confidence);
  classifyPose();
}

//classify end
function gotResult3(error, results) {
  console.log("gotResult3");
    if(track ==3){
    classifier.classify(gotResult4);
  }
}

///04MainEntrance
function gotResult4(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  console.log(label);
  if(label =="clap"){
    if (track == 3){
    track=4;
    }
  }
}

function worship(){
    //measurement
    leftWristAnkleDist = dist(
      pose.leftWrist.x,
      pose.leftWrist.y,
      pose.leftAnkle.x,
      pose.leftAnkle.y
    );
    console.log( leftWristAnkleDist);
    if (leftWristAnkleDist<50) {
      if (snapshots.length < 1){
          takesnap();
          }
      //console.log('ok');
      setTimeout(function(){
        hide =1;
        track=5;
      },1000);
      setTimeout(function(){
        track = 6;
        hide = 0;
        classifyPose();
      },10000);
    }
}

//Y
function gotResult5(error, results) {
  console.log("gotResult5");
  console.log("Y",results[0].confidence);
  if (results[0].confidence > 0.95) {
    poseLabel = results[0].label.toUpperCase();
    // if (poseLabel == "Y") {
      console.log("true");
      //delayTime(3000);
      setTimeout(function () {
          window.location.href="../exit/index2.html";
      }, 1000);
    // }
    console.log(track);
  }
  //console.log(results[0].confidence);
  classifyPose();
}

///for 07Exit
// function gotResults5(error, results){
//   if (error) {
//     console.log("something went wrong");
//     console.error(error);
//   }
//   said = results[0].label;
//   console.log(said);
//   if(said=="yes"){
//     track =7;
//     noLoop();
//   }else if (said =="no"){
//     setTimeout(function(){
//       track =0;
//     },3000);

//   }
// }

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log("poseNet ready");
}

function getScene(scene) {
  // if (scene < 4) {
  //   image(img[scene], 0, 0, width, height);
  // } else {
  //   console.log("end");
  //   image(img[3], 0, 0, width, height);
  // }
  image(img[scene], 0, 0, width, height);
}

function draw() {
  fill(255, 0, 255);
  noStroke();
  textSize(512);
  textAlign(CENTER, CENTER);
  if (1< track < 8) {
    getScene(track);
  }
  // } else {
  //   image(img[3], 0, 0, 640, 480);
  // }
  text(poseLabel, width / 2, height / 2);

  if (hide == 0) {
  drawSkeleton();
  drawKeypoints();
}
  if (track == 5){
   drawSnapshots();
  }
  descrChange();


  // if(track==6){
  //   // let soundOptions = { probabilityThreshold: 0.95 };
  //   // soundClassifier = ml5.soundClassifier("SpeechCommands18w", soundOptions);
  //   soundClassifier.classify(gotResults5);
  // }

}

// A function to draw the skeletons
function drawKeypoints(){
   push();
  translate(video.width, 0);
  scale(-1, 1);
  //image(video, 0, 0, video.width, video.height);

  if (pose) {
      strokeWeight(2);
      //stroke(255);
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }

}
}
function drawSkeleton() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  //image(video, 0, 0, video.width, video.height);

  if (pose) {
      strokeWeight(2);
      stroke(255);

    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      //strokeWeight(2);
      //stroke(255);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }


    if (track == 0) {
      pupilDetection();
    }else if(track == 4){
      worship();
    }
  }
  pop();
}

function keyPressed() {
  if (track < 8) {
    track += 1;
  } else {
    track = 0;
  }
  console.log("key is pressed");
}

function mouseClicked(){
  classifyPose();

}

function pupilDetection() {
  ////Entrance pupil detection////
  eyeDist = dist(
    pose.leftEye.x,
    pose.leftEye.y,
    pose.rightEye.x,
    pose.rightEye.y
  );
  //console.log(eyeDist);
  if (eyeDist > 110) {
    if (track < 1) {
      track++;
      classifyPose();
      //track = guan;
    }
    console.log("track", track);
  }
}



function takesnap(){
  snapshots.push(video.get());
}

function drawSnapshots(){
  for (var i = 0; i < snapshots.length; i++){
  image(snapshots[i],width/2-200,height/2-200,400,400);
  }
  // var w = 80;
  // var h = 60;
  // var x = 0;
  // var y = 0;
  // for (var i = 0; i < snapshots.length; i++){
  //   image(snapshots[i],x,y,w,h)
  //   x = x + w;
  //   if (x > w){
  //     x = 0;
  //     y = y + h;
  //   }
  // }
}

function descrChange(){
  if(track == 1){
    document.getElementById("textHint").innerHTML= "Now you have entered the technology temple,<br>Please feel free to appreciate this collection of art,<br>All of them are created by our finest artists. <br>Find your way! <br><br>Hint: Please turn left by posing as follows to access the next spot.<br><br><img src='images/left.png' width='400px' height ='200px'> ";
    document.getElementById("paintDescr").innerHTML= "VQGAN+CLIP (mangtronix), <br>Featuring DeepStory.<br>Strange Bits of Information Float Through the Air, 2021.<br>Digital on screen. 592×592 pixel.<br>Technology Worship Collection.<br><br>VQGAN+CLIP (mangtronix), <br>Featuring DeepStory.<br>Someone’s Blog About Why We’re All Getting Younger, 2021.<br>Digital on screen. 592×592 pixel.<br>Technology Worship Collection.";
    // addImage();
    // document.getElementById("descrImage").src="images/left.png";
  }else if(track ==2){
    document.getElementById("textHint").innerHTML = "Feel free to appreciate this collection of art,<br>All of them are created by our finest artists.<br><br>Hint: Please turn right by posing as follows to access the next spot.<br><br><img src='images/right.png' width='400px' height ='200px'>";
    document.getElementById("paintDescr").innerHTML = "VQGAN+CLIP (mangtronix), <br>Featuring DeepStory.<br>A Photo of A Younger Me, 2021.<br>Digital on screen. 592×592 pixel.<br><br>Technology Worship Collection.<br>VQGAN+CLIP (mangtronix), <br>A Photo of The Ex-Terrains, 2021.<br>Digital on screen. 592×592 pixel.<br>Technology Worship Collection.<br>";
    // document.getElementById("descrImage").src="images/right.png";
  }else if (track == 3){
    document.getElementById("textHint").innerHTML = "Now, my son.<br>In front of you is the main room of the Great Intellectual.<br>Applaud! Show me your passion!<br><br>Hint:<br>Clap your hands.";
    document.getElementById("paintDescr").innerHTML = "VQGAN+CLIP (mangtronix), <br>Featuring DeepStory.<br>The Ex-Terrains with Their Arms Around Each Other, 2021.<br>Digital on screen. 592×592 pixel.<br>Technology Worship Collection.";
  }else if (track == 4){
    document.getElementById("textHint").innerHTML = "Now, followers,<br>In front of you presents the Great Oracles. <br>Worship! Worship the Technology Almighty in piety!<br><br>Hint:<br>Reach down to your feet. Get both of your hands close to your feet.";
    document.getElementById("paintDescr").innerHTML = "VQGAN+CLIP (mangtronix), <br>Featuring Poem Portraits.<br>Technology Oracle, 2021.<br>Digital on screen. 592×592 pixel.<br>Technology Worship Collection.<br><br>VQGAN+CLIP (mangtronix), <br>Featuring Poem Portraits.<br>Humanity Oracle, 2021.<br>Digital on screen. 592×592 pixel.<br>Technology Worship Collection.<br><br>VQGAN+CLIP (mangtronix), <br>Featuring Poem Portraits.<br>Future Oracle, 2021.<br>Digital on screen. 592×592 pixel.<br>Technology Worship Collection.";
  }else if (track == 5){
    document.getElementById("textHint").innerHTML = "This is the photo gallery of your worships. <br>The Technology Almighty will remember you.";
    document.getElementById("paintDescr").innerHTML = " ";
  }else if (track == 6){
    document.getElementById("textHint").innerHTML = "Now, raise your arms. <br> Cheer for the technology!<br><br>Hint:<br><img src='images/Y.png' width='400px' height ='200px'>";
    // document.getElementById("paintDescr").innerHTML = " ";
  }
};

// function addImage(){
//             var img = document.getElementById("hintBox").createElement('img');
//             img.src = 'images/left.png';
//             img.id = "img";
//             img.setAttribute("height", "100");
//             img.setAttribute("width", "200");
//             document.getElementById('body').appendChild(img);
// }
