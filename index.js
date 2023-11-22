let animationId;
let stopPositions;
let clickedElementId;
let initialAngle = 0;
let isAnimationStopped = true;
let currentPosition;

const rotatingDiv = document.getElementById("rotatingDiv");
const rotatingDivs = document.querySelectorAll(".rotating-div");
const rotatingDivRect = rotatingDiv.getBoundingClientRect();
const itemTextContainer = document.querySelectorAll(".item-container");
const radius = rotatingDivRect.width / 2;

function positionElements() {
  const numDivs = rotatingDivs.length;
  const angleIncrement = (2 * Math.PI) / numDivs;

  rotatingDivs.forEach((div, index) => {
    const angle = index * angleIncrement;

    const x =
      rotatingDivRect.width / 2 +
      radius * Math.cos(angle) -
      div.clientWidth / 2;
    const y =
      rotatingDivRect.height / 2 +
      radius * Math.sin(angle) -
      div.clientHeight / 2;
    if (index === 0) {
      stopPositions = {
        x,
        y,
      };
    }

    div.style.left = `${x}px`;
    div.style.top = `${y}px`;

    div.addEventListener("click", (event) => {
      // console.log(event.target.style.left);
      isAnimationStopped = false;
      clickedElementId = event.target.getAttribute("id");
      moveElements();
    });
  });
}

function positionPlanet() {
  const planetImg = document.querySelector(".planet");
  const x = stopPositions.x - 330;
  const y = stopPositions.y - 125;
  planetImg.style.left = `${x}px`;
  planetImg.style.top = `${y}px`;
}

function moveElements() {
  let angle = initialAngle;

  function animate() {
    if (!isAnimationStopped) {
      itemTextContainer.forEach((item) => {
        item.classList.remove("visible");
      });
    }

    rotatingDivs.forEach((div, index) => {
      const currentAngle =
        angle + (index * (2 * Math.PI)) / rotatingDivs.length;
      const x =
        rotatingDivRect.width / 2 +
        radius * Math.cos(currentAngle) -
        div.clientWidth / 2;

      const y =
        rotatingDivRect.height / 2 +
        radius * Math.sin(currentAngle) -
        div.clientHeight / 2;

      div.style.left = `${x}px`;
      div.style.top = `${y}px`;

      if (clickedElementId === div.getAttribute("id")) {
        currentPosition = x;
      }
    });

    if (Math.round(currentPosition) === Math.round(stopPositions.x)) {
      stopAnimation();
    } else {
      angle += 0.01;
      initialAngle = angle;
      animationId = requestAnimationFrame(animate);
    }
  }
  animate();
}

function stopAnimation() {
  itemTextContainer.forEach((item) => {
    if (item.id === `textBlock${clickedElementId.slice(-1)}`) {
      item.classList.add("visible");
    }
  });

  isAnimationStopped = true;
  cancelAnimationFrame(animationId);
}

positionElements();
positionPlanet();
window.addEventListener("resize", positionElements);
