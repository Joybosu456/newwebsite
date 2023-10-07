const progress = [...document.querySelectorAll(".form-progress .done")];
const recentProgress = progress[progress.length - 1];
const recentProgressText = recentProgress.innerHTML.toLowerCase();
const childNode = document.createElement("p");
childNode.className = "progress-tooltip";
childNode.innerHTML = `  <span class="d-flex align-items-center">Great<img src="assets/images/gif/hand-wave.gif" alt=""></span>
                            <span class="d-block">We got your ${recentProgressText}!</span>
                           `;
recentProgress.appendChild(childNode);

setTimeout(() => {
  childNode.style.display = "none";
}, 5000);
