(function () {
    var width = 640;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream
    var streaming = false;

    var video = null;
    var canvas = null;
    var photo = null;
    var captureButton = null;
    var cameraModal = null;
    var closeModalButton = null;
    var fotoInput = null;
    var openCameraButton = null;
    // var pageform = null;

    function startup() {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        photo = document.getElementById('photo');
        captureButton = document.getElementById('captureButton');
        cameraModal = document.getElementById('cameraModal');
        closeModalButton = document.getElementById('closeModalButton');
        fotoInput = document.getElementById('foto');
        openCameraButton = document.getElementById('openCameraButton');
        // pageform = document.getElementById('pageform');

        captureButton.addEventListener('click', function (ev) {
            takepicture();
            ev.preventDefault();
            cameraModal.style.display = "none";
            closeWebCam();
        }, false);

        openCameraButton.addEventListener('mouseup', function (ev) {
            ev.preventDefault();
            cameraModal.style.display = "block";
            openWebCam();
        }, false);
        photo.addEventListener('mouseup', function (ev) {
            cameraModal.style.display = "block";
            openWebCam();
        }, false);

        closeModalButton.addEventListener('mouseup', function (ev) {
            closeWebCam();
            cameraModal.style.display = "none";
        }, false);
    }

    function openWebCam(){
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function (err) {
                console.log("An error occurred: " + err);
                document.querySelector("#error-message").innerHTML = "No webcam detected or Pemission denied";
            });

        video.addEventListener('canplay', function (ev) {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);

                if (isNaN(height)) {
                    height = width / (4 / 3);
                }

                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }
        }, false);
    }

    function closeWebCam(){
        if(video.srcObject !== null){
            video.srcObject.getTracks().forEach(function(track) {
                track.stop();
            });
        }
    }

    function takepicture() {
        var context = canvas.getContext('2d');
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            var data = canvas.toDataURL('image/png');
            photo.setAttribute('src', data);

            fotoInput.value = data.replace("data:image/png;base64,","");
            // pageform.submit();
        } else {
            // clearphoto();
        }
    }

    window.addEventListener('load', startup, false);
})();