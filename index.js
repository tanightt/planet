let animationId;
let stopPositions;
let clickedElementId;
let initialAngle = 0;
let isAnimationStopped = true;
let currentPosition;

const rotatingDiv = document.getElementById("rotatingDiv");
const rotatingDivs = document.querySelectorAll(".rotating-div");
const rotatingDivRect = rotatingDiv.getBoundingClientRect();
const titleItems = document.querySelectorAll(".item-title");
const textItems = document.querySelectorAll(".item-text");
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

function positionTitle() {
  const numDivs = rotatingDivs.length;
  const angleIncrement = (2 * Math.PI) / numDivs;
  titleItems.forEach((item, index) => {
    const angle = index * angleIncrement;

    const x =
      rotatingDivRect.width / 2 +
      radius * Math.cos(angle) -
      item.clientWidth / 2;

    const y =
      rotatingDivRect.height / 2 +
      radius * Math.sin(angle) -
      item.clientHeight / 2;

    if (!isAnimationStopped) {
      const currentAngle = initialAngle + (index * (2 * Math.PI)) / numDivs;
      const currentX =
        rotatingDivRect.width / 2 +
        radius * Math.cos(currentAngle) -
        item.clientWidth / 2;

      const currentY =
        rotatingDivRect.height / 2 +
        radius * Math.sin(currentAngle) -
        item.clientHeight / 2;

      item.style.left = `${currentX}px`;
      item.style.top = `${currentY}px`;
    } else {
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      if (x > 0) {
        item.style.transform = `translateX(30px)`;
      } else {
        item.style.transform = `translateX(-400px)`;
      }
    }
  });
}

function animateArrows(angle) {
  const arrowElements = document.querySelectorAll(".arrow");
  arrowElements.forEach((arrow, index) => {
    const rotationAngle = angle + index * arrowElements.length + 95;
    arrow.style.transform = `rotate(${rotationAngle}deg)`;
  });
}

function moveElements() {
  let angle = initialAngle;

  function animate() {
    if (!isAnimationStopped) {
      titleItems.forEach((item) => {
        item.classList.add("hidden");
      });
      textItems.forEach((item) => {
        item.classList.remove("visible");
      });
    }

    rotatingDivs.forEach((div, index) => {
      const currentAngle =
        angle + (index * (2 * Math.PI)) / rotatingDivs.length;
      animateArrows(currentAngle);
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

    // positionTitle();

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
  // positionTitle();
  titleItems.forEach((item) => {
    item.classList.remove("hidden");
  });

  textItems.forEach((item) => {
    if (item.id === `textBlock${clickedElementId.slice(-1)}`) {
      item.classList.add("visible");
    }
  });
  isAnimationStopped = true;
  cancelAnimationFrame(animationId);
}

positionElements();
positionPlanet();
// positionTitle();
window.addEventListener("resize", positionElements);
