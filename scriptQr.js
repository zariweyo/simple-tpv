// Webcam and QR scanner script
const video = document.getElementById('webcam');
const canvas = document.getElementById('qr-canvas');
const context = canvas.getContext('2d');

// Polyfill for getUserMedia
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
            video.addEventListener('play', function () {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                scanQRCode();
            });
        })
        .catch(function (error) {
            console.error("Error accessing webcam: ", error);
        });
} else if (navigator.getUserMedia) {
    navigator.getUserMedia({ video: true },
        function (stream) {
            video.srcObject = stream;
            video.addEventListener('play', function () {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                scanQRCode();
            });
        },
        function (error) {
            console.error("Error accessing webcam: ", error);
        });
} else {
    console.error("getUserMedia not supported in this browser.");
}

function scanQRCode() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            addQR(code.data);
        }
    }
    requestAnimationFrame(scanQRCode);
}