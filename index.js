const fileInput = document.querySelector(".file-input");
const chooseImgBtn = document.querySelector(".choose-img");
const previewImg = document.querySelector(".preview-img img"),
    filterOptions = document.querySelectorAll(".filter button"),
    rotateOptions = document.querySelectorAll(".rotate button"),
    filterSlider = document.querySelector(".slider input"),
    filterValue = document.querySelector(".filter-info .value"),
    resetFilterBtn = document.querySelector(".reset-filter"),
    saveImageBtn = document.querySelector(".save-img");
let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

function applyFilter() {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical}) `;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

const loadImage = () => {
    let file = fileInput.files[0];
    if (!file) return;
    previewImg.src = URL.createObjectURL(file);
    //console.log(file);
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click();
        document.querySelector(".container").classList.remove("disable");
    })


}

const handleFilterBtn = () => {
    filterOptions.forEach(option => {
        option.addEventListener("click", () => {
            document.querySelector(".filter .active").classList.remove("active");
            option.classList.add("active");
            document.querySelector(".filter-info .name").innerText = option.innerText;

            if (option.id === "brightness") {
                filterSlider.max = "200";
                filterSlider.value = brightness;
                filterValue.innerText = `${brightness}%`;
            } else if (option.id === "saturation") {
                filterSlider.max = "200";
                filterSlider.value = saturation;
                filterValue.innerText = `${saturation}%`;
            } else if (option.id === "inversion") {
                filterSlider.max = "100";
                filterSlider.value = inversion;
                filterValue.innerText = `${inversion}%`;
            } else {
                filterSlider.max = "100";
                filterSlider.value = grayscale;
                filterValue.innerText = `${grayscale}%`;
            }
        })
    });
}

function handleSlider() {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");
    if (selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if (selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if (selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFilter();
}

const handleRotateBtn = () => {
    rotateOptions.forEach((option) => {
        option.addEventListener("click", () => {
            if (option.id === "left") {
                rotate = rotate - 90;
            } else if (option.id === "right") {
                rotate += 90;
            } else if (option.id === "horizontal") {
                flipHorizontal = flipHorizontal === 1 ? -1 : 1;
            } else {
                flipVertical = flipVertical === 1 ? -1 : 1;
            }
            applyFilter();
        })
    })
}

const handleResetFilter = () => {
    brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
    rotate = 0, flipHorizontal = 1, flipVertical = 1;
    filterOptions[0].click();
    applyFilter();
}

const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");///getContext->return a drawing contxt on canvas
    canvas.width = previewImg.naturalWidth;//set canvas width to actual img width
    canvas.height = previewImg.naturalHeight;//set canvas height to actual img height

    //apply filter to canvas
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    //apply flip
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(flipHorizontal, flipVertical);
    //apply rotate
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    //document.body.appendChild(canvas);

    ///download img
    const link = document.createElement("a");
    console.log(link);
    link.download = "image.jpg"; //passing <a> tag download value to image.jpg
    link.href = canvas.toDataURL();//passing <a> href to canvas data url
    link.click();//click <a tag so the img downloaded
}

fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());
handleFilterBtn();
filterSlider.addEventListener("input", handleSlider);
handleRotateBtn();
resetFilterBtn.addEventListener("click", handleResetFilter);
saveImageBtn.addEventListener("click", saveImage);
