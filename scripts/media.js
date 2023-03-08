const videosContainer = document.querySelector(".videos-container");
const imagesContainer = document.querySelector(".images-container");
const videos = videosContainer.getElementsByTagName("video");
const images = imagesContainer.getElementsByClassName("grid-image");
const videoFader = videosContainer.getElementsByClassName("fader")[0];
const imagesNavs = document.querySelector(".images-navs");
const imageNavLeft = document.querySelector(".image-nav-left");
const imageNavRight = document.querySelector(".image-nav-right");
const videoSources = [];
const imageSources = [];
const videoLengths = [];
let videoPaused = false;
let videoSwitch;
let videoTime;
let fadeOut;
let fadeIn;
let activeImage = imagesContainer.querySelector('.active');
let imageOffset = activeImage.getBoundingClientRect().width;
let nextImage;
let previousImage;
for (let i = 0; i < videos.length; i++) {
    videoSources[i] = videos[i].getAttribute("src");
    videos[i].addEventListener("loadedmetadata", () => {
        videoLengths[i] = videos[i].duration;
    });
}
for (let i = 0; i < images.length; i++) {
    imageSources[i] = images[i].getAttribute("src");
}

function fade(element, fadeOutEnd, length) {
    clearTimeout(fadeOut);
    clearTimeout(fadeIn);
    fadeOut = setTimeout(() => {
        element.style.opacity = 1;
    }, (fadeOutEnd - length) * 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    let mediaQueryInfo = window.matchMedia("(max-width: 718px)");
    // check if media query condition is met
    if (mediaQueryInfo.matches) {
        videos[0].removeAttribute("loop");
    }

    let mediaQueryInfo_2 = window.matchMedia("(max-width: 430px)");
    // check if media query condition is met
    if (mediaQueryInfo_2.matches) {
        imageNavRight.style.display = "block";
        let navOffset = images[1].parentElement.getBoundingClientRect().height / 2;
        imageNavLeft.style.top = imagesNavs.getBoundingClientRect().height + navOffset + 'px';
        imageNavRight.style.top = imagesNavs.getBoundingClientRect().height + navOffset + 'px';
        for (let i = 2; i < images.length; i++) {
            images[i].parentElement.style.left = imageOffset + 'px';
        }
    }
});
window.addEventListener("resize", () => {
    let mediaQueryInfo = window.matchMedia("(max-width: 718px)");
    // check if media query condition is met
    if (mediaQueryInfo.matches) {
        videos[0].removeAttribute("loop");
        if (videoSwitch == false) {
            videos[0].currentTime = 0;
        }
        videoSwitch = true;
    } else {
        clearTimeout(fadeOut);
        clearTimeout(fadeIn);
        videoSwitch = false;
        if (!videos[0].hasAttribute("loop")) {
            videos[0].setAttribute("loop", "loop");
        }
        if (videos[0].getAttribute("src") != videoSources[0]) {
        videos[0].setAttribute("src", videoSources[0]);
        }
    }

    let mediaQueryInfo_2 = window.matchMedia("(max-width: 430px)");
    // check if media query condition is met
    if (mediaQueryInfo_2.matches) {
        for (const image of images) {
            image.parentElement.style.transition = 'transform 0ms linear';
        }
        activeImage = imagesContainer.querySelector('.active');
        if (activeImage !== imagesContainer.lastElementChild) {
            imageNavRight.style.display = "block";
        }
        imageOffset = activeImage.getBoundingClientRect().width;
        let navOffset = images[1].parentElement.getBoundingClientRect().height / 2;
        imageNavLeft.style.top = imagesNavs.getBoundingClientRect().height + navOffset + 'px';
        imageNavRight.style.top = imagesNavs.getBoundingClientRect().height + navOffset + 'px';
        for (let i = 2; i < images.length; i++) {
            images[i].parentElement.style.left = imageOffset + 'px';
        }
        if (activeImage != images[1].parentElement) {
            activeImage.style.transform = `translateX(-${imageOffset}px)`;
            previousImage = activeImage.previousElementSibling;
            if (previousImage == images[1].parentElement) {
                previousImage.style.transform = `translateX(-${imageOffset}px)`;
            } else {
                previousImage.style.transform = `translateX(-${imageOffset * 2}px)`;  
            }
            if (activeImage !== imagesContainer.lastElementChild) {
                nextImage = activeImage.nextElementSibling;
                nextImage.style.transform = `translateX(0px)`;
            }
        }
    } else {
        for (let i = 1; i < images.length; i++) {
            images[i].parentElement.removeAttribute('style');
        }
    }
});
videos[0].addEventListener("ended", () => {
    if (!videos[0].hasAttribute("loop")) {
        let src = videos[0].getAttribute("src");
        let sourceIndex = videoSources.indexOf(src);
        if (sourceIndex == videoSources.length - 1) {
            videos[0].setAttribute("src", videoSources[0]);
        } else {
            videos[0].setAttribute("src", videoSources[sourceIndex + 1]);
        }
    }
});
videos[0].addEventListener("playing", () => {
    if (!videos[0].hasAttribute("loop")) {    
        if (videoPaused || videoFader.style.opacity == 1) {
            setTimeout(() => {
                videoFader.style.opacity = 0;
                videoPaused = false;
            }, 200);
        }
        let src = videos[0].getAttribute("src");
        let sourceIndex = videoSources.indexOf(src);
        let videoLength = videoLengths[sourceIndex];
        videoTime = videos[0].currentTime;
        if (videoLength - videoTime >= .5) {
            fade(videoFader, videoLength - videoTime, .5);
        }
    }
});
videos[0].addEventListener("pause", () => {
    if (videos[0].currentTime != videos[0].duration && !videos[0].hasAttribute("loop")) {
        videoPaused = true;
        clearTimeout(fadeOut);
        clearTimeout(fadeIn);
        videoFader.style.opacity = 1;
        let src = videos[0].getAttribute("src");
        let sourceIndex = videoSources.indexOf(src);
        if (sourceIndex == videoSources.length - 1) {
            videos[0].setAttribute("src", videoSources[0]);
        } else {
            videos[0].setAttribute("src", videoSources[sourceIndex + 1]);
        }
    }
})

imageNavRight.addEventListener("click", () => {
    for (const image of images) {
        image.parentElement.style.transition = 'transform 250ms linear';
    }
    activeImage = imagesContainer.querySelector('.active');
    nextImage = activeImage.nextElementSibling;
    if (activeImage == images[1].parentElement) {
        activeImage.style.transform = `translateX(-${imageOffset}px)`;
        nextImage.style.transform = `translateX(-${imageOffset}px)`;
    } else {
        activeImage.style.transform = `translateX(-${imageOffset * 2}px)`;
        nextImage.style.transform = `translateX(-${imageOffset}px)`;
    }
    imageNavLeft.style.display = "block";
    activeImage.classList.remove('active');
    nextImage.classList.add('active');
    if (nextImage == imagesContainer.lastElementChild) {
        imageNavRight.style.display = "none";
    }
})

imageNavLeft.addEventListener("click", () => {
    for (const image of images) {
        image.parentElement.style.transition = 'transform 250ms linear';
    }
    activeImage = imagesContainer.querySelector('.active');
    previousImage = activeImage.previousElementSibling;
    activeImage.style.transform = `translateX(0px)`;
    if (previousImage == images[1].parentElement) {
        previousImage.style.transform = `translateX(0px)`;
        imageNavLeft.style.display = "none";
    } else {
        previousImage.style.transform = `translateX(-${imageOffset}px)`;
    }
    imageNavRight.style.display = "block";
    activeImage.classList.remove('active');
    previousImage.classList.add('active');
})
