let soundClassifier;
let said;
let img;
let poseNet;
let pose;
let video;
let skeleton;

function preload(){
  img = loadImage("image/07exit.png");
  let soundOptions = { probabilityThreshold: 0.95 };
  soundClassifier = ml5.soundClassifier("SpeechCommands18w", soundOptions);
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);
  soundClassifier.classify(gotResults);

//   link = createA("https://www.geeksforgeeks.org/",
//                        "Go to GeeksforGeeks", "_blank");
}

function gotResults(error, results) {
  if (error) {
    console.log("something went wrong");
    console.error(error);
  }

  said = results[0].label;
  console.log(said);
}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}


function modelLoaded() {
  console.log("poseNet loaded");
}

function draw() {
  background(220);
  // translate(video.width, 0);
  // scale(-1, 1);
  image(img, 0, 0, width, height);

  drawSkeleton();
  drawKeypoints();

  if(said){
    decision();
  }
}

function drawKeypoints(){
  //  push();
  // translate(video.width, 0);
  // scale(-1, 1);
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
  // push();
  // translate(video.width, 0);
  // scale(-1, 1);
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
  }
}

function decision(){
  if (said == "yes") {
    //print out height
   window.location.href = 'http://www.google.com';
    //noLoop();
    //noLoop();
  }else if (said == "no") {
    select("#test").html("no");
    noLoop();
  }
}
