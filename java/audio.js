const recordBtn = document.getElementById('record');
const stopBtn = document.getElementById('stop');

//turned the video into false because only the audio is necessary here
const constraints = {video: false, audio: true};

let chunks = [];
//this function will start to record the audio
function record() {
    //getting the users media devices permission
    navigator.mediaDevices.getUserMedia(constraints)

    .then((str) => {

      const recorder = new MediaRecorder(str);

      window.mediaStream = str;
	    window.mediaRecorder = recorder;

      recordBtn.disabled = true;
      stopBtn.disabled = false;

      recorder.start();

      recorder.ondataavailable = (e) => {chunks.push(e.data);};

      recorder.onstop = () => {
        //default format for the recorded audio is mp3
        const recorded = new Blob(chunks, { type: "audio/mp3" });

        chunks = [];

        const recordedVid = document.createElement("audio");

				recordedVid.controls = true;

				recordedVid.src = URL.createObjectURL(recorded);

        const downloadBtn = document.createElement("a");

        downloadBtn.href = URL.createObjectURL(recorded);

				downloadBtn.innerText = "Download";

        document.getElementById("recordedVid").append(recordedVid, downloadBtn);
      };
    })
    
    .catch((err) => {

      alert(err)
    });
}

function stop() {

    window.mediaRecorder.stop();

    window.mediaStream.getTracks()
    .forEach((track) => {
      track.stop();
    });

    recordBtn.disabled = false;
    stopBtn.disabled = true;
}