
const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");
// global variables with default value
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";
const setCanvasBackground = () => {
    //  définir l'arrière-plan de l'ensemble du canevas en blanc, afin que l'arrière-plan de l'image téléchargée soit blanc.
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // en redonnant à fillstyle la selectedColor, ce sera la couleur de la brosse.
}
window.addEventListener("load", () => {
    // définir la largeur/hauteur du canevas... offsetwidth/height renvoie la largeur/hauteur visible d'un élément
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});
const drawRect = (e) => {
    // si fillColor n'est pas coché, dessine un rectangle avec une bordure, sinon, dessine un rectangle avec un fond.
    if(!fillColor.checked) {
        // création d'un cercle en fonction du pointeur de la souris
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}
const drawCircle = (e) => {
    ctx.beginPath(); // création d'un nouveau chemin pour dessiner un cercle
    // obtention du rayon du cercle en fonction du pointeur de la souris
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // creating circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
}
const drawTriangle = (e) => {
    ctx.beginPath(); //création d'un nouveau chemin pour dessiner un cercle
    ctx.moveTo(prevMouseX, prevMouseY); // déplacement du triangle vers le pointeur de la souris
    ctx.lineTo(e.offsetX, e.offsetY); // création de la première ligne en fonction du pointeur de la souris
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // création de la ligne inférieure du triangle
    ctx.closePath(); // le chemin de fermeture d'un triangle pour que la troisième ligne se dessine automatiquement
    fillColor.checked ? ctx.fill() : ctx.stroke(); // si fillColor est coché remplir le triangle sinon dessiner la bordure
}
const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // passage de la position actuelle de la souris en tant que valeur prevMouseX
    prevMouseY = e.offsetY; // passage de la position actuelle de la souris en tant que valeur prevMouseY
    ctx.beginPath(); // création d'un nouveau chemin à dessiner
    ctx.lineWidth = brushWidth; // en passant brushSize comme largeur de ligne
    ctx.strokeStyle = selectedColor; //passer selectedColor comme style de trait
    ctx.fillStyle = selectedColor; // passer selectedColor comme style de remplissage
    // copier les données du canevas et les transmettre comme valeur instantanée... cela évite de faire glisser l'image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}
const drawing = (e) => {
    if(!isDrawing) return; // si isDrawing est faux, retour à partir d'ici
    ctx.putImageData(snapshot, 0, 0) ; // ajout des données copiées sur ce canevas
    if(selectedTool === "brush" || selectedTool === "eraser") {
        // Si l'outil sélectionné est une gomme, définissez le strokeStyle sur blanc. 
        // pour peindre une couleur blanche sur le contenu existant du canevas ; sinon, définissez la couleur du trait sur la couleur sélectionnée.
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // création d'une ligne en fonction du pointeur de la souris
        ctx.stroke(); // Dessiner/remplir une ligne avec de la couleur
    } else if(selectedTool === "rectangle"){
        drawRect(e);
    } else if(selectedTool === "circle"){
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // ajout d'un événement de clic à toutes les options de l'outil
        // supprimer la classe active de l'option précédente et l'ajouter à l'option du clic en cours
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});
sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // en passant la valeur du curseur comme brushSize
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // ajout d'un événement de clic à tous les boutons de couleur
        // supprimer la classe sélectionnée de l'option précédente et l'ajouter à l'option courante cliquée
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // transmettre la couleur de fond du btn sélectionné comme valeur de selectedColor
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});
colorPicker.addEventListener("change", () => {
    //passage de la valeur de la couleur choisie par le sélecteur de couleur au fond du dernier btn de couleur
    colorPicker.parentElement.style.background = colorPicker.value ;
    colorPicker.parentElement.click();
});
clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // effacer toute la toile
    setCanvasBackground();
});
saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`; // passer la date actuelle comme valeur de téléchargement du lien
    link.href = canvas.toDataURL(); // transmission de canvasData comme valeur du lien href
    link.click(); // clicking link to download image
});
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);

