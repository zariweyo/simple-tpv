var data = [];
const beepSound = new Audio('miau.mp3'); // Add the beep sound file

function addRow() {
    // Obtener los valores de los inputs
    const col1Value = document.getElementById('col1').value;
    const col2Value = document.getElementById('col2').value;

    // Validar que ambos campos tengan contenido
    if (col1Value === '' || col2Value === '') {
        alert('Por favor, complete ambos campos.');
        return;
    }

    addRow2(col1Value, col2Value);
}

function addQR(qrData) {
    const qrSplit = qrData.split(":");
    if (qrSplit.length > 1 && parseFloat(qrSplit[1]) > 0) {
        if (data.length > 0 && data[data.length - 1].product !== qrSplit[0]
            && data[data.length - 1].price !== parseFloat(qrSplit[1])) {
            addRow2(qrSplit[0], qrSplit[1]);
            beepSound.play(); // Play beep sound
        } else if (data.length === 0) {
            addRow2(qrSplit[0], qrSplit[1]);
            beepSound.play(); // Play beep sound
        }
    }
}

function addRow2(product, price) {
    // Crear una nueva fila y celdas
    const table = document.getElementById('dynamicTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);

    // Asignar los valores a las celdas
    cell1.textContent = product;
    cell2.textContent = price + "€";
    cell2.style.textAlign = "right";

    data.push({
        product: product,
        price: parseFloat(price)
    });

    // Crear el botón de eliminar
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.onclick = function () {
        deleteRow(this);
    };
    const qrButton = document.createElement('button');
    qrButton.textContent = 'QR';
    qrButton.onclick = function () {
        printQR(this);
    };
    cell3.appendChild(deleteButton);
    cell3.appendChild(qrButton);

    // Limpiar los inputs
    document.getElementById('col1').value = '';
    document.getElementById('col2').value = '';
    document.getElementById("total").innerHTML = total() + "€";
}

function total() {
    var total = 0;
    for (var i = 0; i < data.length; i++) {
        total += data[i].price;
    }
    return total;
}

function deleteRow(button) {
    // Obtener la fila que contiene el botón y eliminarla
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    data.splice(row.rowIndex - 1, 1);
    document.getElementById("total").innerHTML = total();
}

function printQR(button) {
    const row = button.parentNode.parentNode;
    const qrText = data[row.rowIndex - 1].product + ":" + data[row.rowIndex - 1].price;

    // Create a new window to display the QR code
    const qrWindow = window.open('', '', 'width=58');
    qrWindow.document.write('<html><head><title>QR Code</title></head><body>');
    qrWindow.document.write('<div id="qrcode"></div>');
    qrWindow.document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>');
    qrWindow.document.write('<script>');
    qrWindow.document.write('new QRCode(document.getElementById("qrcode"), "' + qrText + '");');
    qrWindow.document.write('window.print();');
    qrWindow.document.write('</script>');
    qrWindow.document.write('</body></html>');
    qrWindow.document.close();
}

function imprimirContenido(id) {
    // Crear una nueva ventana
    var ventanaImpresion = window.open('', '', 'width=58');

    contenido = "<div><img src='https://media.istockphoto.com/id/1206806317/es/vector/icono-del-carrito-de-compras-aislado-sobre-fondo-blanco.jpg?s=612x612&w=0&k=20&c=sdScWRH_AeHdG6vHzMn8xUHCpe7iM6O1Skgi2lPuKG0=' style='width: 50px;'/> MERCAMONA </div>";
    contenido += "<table>";
    contenido += "<tr>";
    contenido += "<td></td>";
    contenido += "<td></td>";
    contenido += "</tr>";
    data.forEach(function (item) {
        contenido += "<tr>";
        contenido += "<td>" + item.product + "</td>";
        contenido += "<td>" + item.price + "€</td>";
        contenido += "</tr>";
    });
    contenido += "<tr>";
    contenido += "<td></td>";
    contenido += "<td></td>";
    contenido += "</tr>";
    contenido += "<tr>";
    contenido += "<td><b>TOTAL:</b></td>";
    contenido += "<td style='text-align: right;'>" + total() + "€</td>";
    contenido += "</tr>";
    contenido += "<tr>";
    contenido += "<td></td>";
    contenido += "<td></td>";
    contenido += "</tr>";
    contenido += "<table>";

    ventanaImpresion.document.write(contenido);
    ventanaImpresion.document.close();
    ventanaImpresion.focus();
    // Iniciar el proceso de impresión
    ventanaImpresion.print();
    // Cerrar la ventana de impresión después de imprimir
    ventanaImpresion.close();
}

