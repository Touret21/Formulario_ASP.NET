var rucInput = document.getElementById("RUC");
var rucInputFocused = false;
var rucInputLength = 0;
var rucError = document.getElementById("rucError");

var folioInput = document.getElementById("folio");
var folioError = document.getElementById("folioError");
var folioPattern = /^[A-Z]{2}\d{2}-\d{7}$/;

var tipoDocumentoSelect = document.getElementById("tipo");

var monto = document.getElementById("monto");
var montoTotalError = document.getElementById("montoTotalError");

var fecha = document.getElementById("fecha");

var captchaValid = false;

var p1 = 0; // Puntos para RUC
var p2 = 0; // Puntos para Folio
var p3 = 0; // Puntos para Tipo de Documento
var p4 = 0; // Puntos para Captcha
var p5 = 0; // Puntos para Monto Total
var p6 = 0; // Puntos para Fecha

// Función de devolución de llamada del captcha
function captchaCallback() {
    captchaValid = true;
    p4 = 1; // Incrementar el contador si el campo es válido
    updateValidatedFieldsCount();
    updateViewDocumentButton();
}

// Evento para controlar el enfoque del campo RUC
rucInput.addEventListener("focus", function () {
    rucInputFocused = true;
});

rucInput.addEventListener("blur", function () {
    rucInputFocused = false;
    validateRUC(); // Llamar a la función de validación al dejar de enfocar el campo
});

// Evento para controlar la longitud actual del campo RUC
rucInput.addEventListener("input", function () {
    rucInputLength = rucInput.value.length;
});

// Función para validar el campo RUC
function validateRUC() {
    if (rucInputFocused || rucInputLength === 0 || isPeruvianRUC(rucInput.value)) {
        rucError.innerHTML = ""; // Limpiar el mensaje de error si el campo está enfocado
        rucError.style.display = "none";
        rucInput.classList.remove("is-invalid");
        p1 = 1;
        updateValidatedFieldsCount();
        updateViewDocumentButton();
        return true;
    }

    rucInputLength = rucInput.value.trim().length;

    if (rucInputLength !== 0 && rucInputLength !== 11) {
        rucError.innerHTML = "El RUC debe contener 11 dígitos";
        rucError.style.display = "block";
        rucInput.classList.add("is-invalid");
        p1 = 0;
        updateValidatedFieldsCount();
        updateViewDocumentButton();
        return false;
    }

    if (rucInputLength === 11 && !isPeruvianRUC(rucInput.value)) {
        rucError.innerHTML = "RUC no válido";
        rucError.style.display = "block";
        rucInput.classList.add("is-invalid");
        p1 = 0;
        updateValidatedFieldsCount();
        updateViewDocumentButton();
        return false;
    }

    rucInput.classList.remove("is-invalid");
    p1 = 0; // Reiniciar los puntos si el campo no es válido
    updateValidatedFieldsCount();
    updateViewDocumentButton();
    return true;
}

// Función para verificar si el RUC es peruano
function isPeruvianRUC(ruc) {
    var rucPattern = /^[0-9]{11}$/; // Patrón para validar el formato del RUC (11 dígitos)

    if (!rucPattern.test(ruc)) {
        return false;
    }

    var factor = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    var sum = 0;

    for (var i = 0; i < factor.length; i++) {
        sum += parseInt(ruc.charAt(i)) * factor[i];
    }

    var remainder = sum % 11;
    var checkDigit = remainder === 0 ? 0 : 11 - remainder;

    var lastDigit = parseInt(ruc.charAt(10));

    return checkDigit === lastDigit;
}

// Función para validar el campo Folio
function validateFolio() {
    var folioValue = folioInput.value.trim();

    if (folioValue === "") {
        folioError.innerHTML = "";
        folioError.style.display = "none";
        p2 = 0;
        updateValidatedFieldsCount();
        updateViewDocumentButton();
        return false;
    }

    if (!folioPattern.test(folioValue)) {
        folioError.innerHTML = "El Folio no es válido";
        folioError.style.display = "block";
        p2 = 0;
        updateValidatedFieldsCount();
        updateViewDocumentButton();
        return false;
    } else {
        folioError.innerHTML = "";
        folioError.style.display = "none";
        p2 = 1;
        updateValidatedFieldsCount();
        updateViewDocumentButton();
        return true;
    }
}

// Función para validar el campo Tipo de Documento
function validateTipoDocumento() {
    var tipoDocumentoValue = tipoDocumentoSelect.value;

    if (
        tipoDocumentoValue === "Factura" ||
        tipoDocumentoValue === "Boleta" ||
        tipoDocumentoValue === "Nota de Crédito" ||
        tipoDocumentoValue === "Nota de Débito"
    ) {
        p3 = 1; // Incrementar los puntos de Tipo de Documento siempre que se seleccione una opción válida
        updateValidatedFieldsCount();
        updateViewDocumentButton();
        return true;
    }

    p3 = 0;
    updateValidatedFieldsCount();
    updateViewDocumentButton();
    return false;
}

function validateMontoTotal() {
    var montoTotalValue = monto.value.trim();

    if (montoTotalValue === "") {
        montoTotalError.innerHTML = "";
        montoTotalError.style.display = "none";
        p5 = 0; // Reiniciar los puntos de Monto Total si el campo está vacío
        updateValidatedFieldsCount();
        updateViewDocumentButton();
        return false;
    }
    // Debe ser un número positivo mayor que cero
    if (isNaN(montoTotalValue) || parseFloat(montoTotalValue) <= 0) {
        montoTotalError.innerHTML = "El Monto Total no es válido";
        montoTotalError.style.display = "block";
        p5 = 0; // Reiniciar los puntos de Monto Total si el campo no es válido
        updateValidatedFieldsCount();
        updateViewDocumentButton();
        return false;
    } else {
        montoTotalError.innerHTML = "";
        montoTotalError.style.display = "none";
        p5 = 1; // Incrementar los puntos de Monto Total si el campo es válido
        updateValidatedFieldsCount();
        updateViewDocumentButton();
        return true;
    }
}

function validateFecha() {
    var fechaValue = fecha.value.trim();

    if (fechaValue === "") {
        fechaError.innerHTML = "";
        fechaError.style.display = "none";
        p6 = 0; // Reiniciar los puntos de Fecha si el campo está vacío
        updateValidatedFieldsCount();
        updateViewDocumentButton();
        return false;
    }

    fechaError.innerHTML = "";
    fechaError.style.display = "none";
    p6 = 1; // Incrementar los puntos de Fecha si el campo no está vacío
    updateValidatedFieldsCount();
    updateViewDocumentButton();
    return true;
}

function updateValidatedFieldsCount() {
    var sumapuntos = p1 + p2 + p3 + p4 + p5 + p6;
    if (sumapuntos === 6) {
        return true;
    } else {
        return false;
    }
}

// Función para habilitar o deshabilitar el botón "VER DOCUMENTO" según el contador de campos validados
function updateViewDocumentButton() {
    var viewDocumentButton = document.getElementById("boton");
    var sumapuntos = p1 + p2 + p3 + p4 + p5 + p6;
    if (sumapuntos === 6) {
        viewDocumentButton.disabled = false;
    } else {
        viewDocumentButton.disabled = true;
    }
}

// Agregar event listeners para la validación en tiempo real
document.getElementById("RUC").addEventListener("input", function () {
    validateRUC();
});
document.getElementById("folio").addEventListener("input", function () {
    validateFolio();
});
document.getElementById("tipo").addEventListener("input", function () {
    validateTipoDocumento();
});
document.getElementById("monto").addEventListener("input", function () {
    validateMontoTotal();
});
document.getElementById("fecha").addEventListener("input", function () {
    validateFecha();
});

// Llamar a las funciones iniciales para deshabilitar el botón
validateRUC();
validateFolio();
validateTipoDocumento();
validateMontoTotal();
validateFecha();
updateValidatedFieldsCount();
updateViewDocumentButton();


function guardarTipoSeleccionado(valor) {
    document.getElementById('Tipo').value = valor;
}