

// Cargar el PDF utilizando PDF.js
var pdfViewer = document.getElementById("pdfViewer");

// Obtener el contenido del PDF en Base64 desde la ViewBag
var pdfContent = "@Convert.ToBase64String(ViewBag.PdfContent)";

// Crear una instancia del visor de PDF
var loadingTask = pdfjsLib.getDocument({ data: atob(pdfContent) });
loadingTask.promise.then(function (pdf) {
    // Cargar la primera página del PDF
    pdf.getPage(1).then(function (page) {
        var scale = 1.5;
        var viewport = page.getViewport({ scale: scale });

        // Crear un lienzo para mostrar la página
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        pdfViewer.appendChild(canvas);

        // Renderizar la página en el lienzo
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        page.render(renderContext);
    });
});


// Al hacer clic en el botón "Retroceder"
document.getElementById("btnPrevious").addEventListener("click", function () {
    window.history.back();
});
//function validarRUC() {
//    var rucInput = document.getElementById("firstName");
//    var rucValue = rucInput.value;

//    if (!EsRucValido(rucValue)) {
//        // Mostrar mensaje de error
//        var errorDiv = document.getElementById("rucError");
//        errorDiv.innerHTML = "El RUC ingresado no es válido.";
//        errorDiv.style.display = "block";

//        // Evitar que el formulario se envíe
//        return false;
//    }

//    // El RUC es válido, permitir el envío del formulario
//    return true;
//}

// Llamada a la función enableViewDocumentButton() cuando se complete la validación del Captcha
