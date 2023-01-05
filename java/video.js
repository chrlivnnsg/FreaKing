const videoEl = document.getElementById('video');
const recordBtn = document.getElementById('record');
const stopBtn = document.getElementById('stop');

//this enables the video and audio
const constraints = {video: true, audio: true};

let chunks = [];
//this function is to record the video
function record() {
    //this gets the usermedias devices such as the camera and microphone
    navigator.mediaDevices.getUserMedia(constraints)

    .then((str) => {

      const recorder = new MediaRecorder(str);

      window.mediaStream = str;
	    window.mediaRecorder = recorder;

      videoEl.muted = true;
      videoEl.autoplay = true;
      videoEl.controls = false;
      videoEl.srcObject = str;

      recordBtn.disabled = true;
      stopBtn.disabled = false;

      recorder.start();

      recorder.ondataavailable = (e) => {chunks.push(e.data);};

      recorder.onstop = () => {

        //the format of the video is set to mp4 by default
        const recorded = new Blob(chunks, { type: "video/mp4" });

        videoEl.src = URL.createObjectURL(recorded);

        chunks = [];

        const recordedVid = document.createElement("video");

				recordedVid.controls = true;

				recordedVid.src = URL.createObjectURL(recorded);

        const downloadBtn = document.createElement("a");

        downloadBtn.href = URL.createObjectURL(recorded);

        //this block is to download the recorded video
				downloadBtn.innerText = "Download"; 

        //this block will show the video that was recorded
        document.getElementById("recordedVid").append(recordedVid, downloadBtn);
      };
    })
    
    .catch((err) => {

      alert(err)
    });
}
//this function is to stop the recording
function stop() {

    window.mediaRecorder.stop();

    window.mediaStream.getTracks()
    .forEach((track) => {
      track.stop();
    });

    recordBtn.disabled = false;
    stopBtn.disabled = true;

    videoEl.muted = false;
    videoEl.autoplay = false;
    videoEl.controls = true;
}