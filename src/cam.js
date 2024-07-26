const video = document.createElement("video");
video.style.position = "absolute";
video.style.top = "0";
video.style.left = "0";
video.style.width = "100%";
video.style.height = "100%";
video.style.objectFit = "cover";
video.style.zIndex = "0"; // Ensure this is below the face detection canvas
document.body.appendChild(video);

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
    video.play();
    console.log("Video stream started");
  })
  .catch((err) => {
    console.error("Error accessing the camera: ", err);
  });

export { video };
