document.getElementById("button").addEventListener("click", addPizza);

function addPizza(event) {
  if (
    document.getElementById("name").value != "" &&
    document.getElementById("name").value.length < 31 &&
    document.getElementById("price").value > 0 &&
    document.getElementById("toppings").value != "" &&
    document.getElementById("toppings").value.length > 1 &&
    isUniqueName(document.getElementById("name").value)
  ) {
    let pizzas = [];
    if (sessionStorage.getItem("PizzaList") !== null) {
      pizzas = JSON.parse(sessionStorage.getItem("PizzaList"));
    }

    let pizza = {
      id: Date.now(),
      name: document.getElementById("name").value,
      price: document.getElementById("price").value,
      heat: document.getElementById("heat").value,
      toppings: document.getElementById("toppings").value.split(","),
      photo: document.getElementById("photo").value,
    };

    pizzas.push(pizza);
    document.querySelector("form").reset();
    document.getElementById("previewImage").src = "./img/no-image.png";
    sessionStorage.setItem("PizzaList", JSON.stringify(pizzas));

    var table = document.getElementById("menuTable");

    function addCell(tr, text) {
      var td = tr.insertCell();
      td.innerHTML = text;
      return td;
    }

    var tr = table.createTBody();
    var row = tr.insertRow();
    const imageHot = getHotImage(pizza.heat);
    addCell(row, "<img src='" + pizza.photo + "' width='120'>");
    addCell(row, pizza.name);
    addCell(row, imageHot);
    addCell(row, getList(pizza.toppings));
    addCell(row, pizza.price + " €");
    addCell(
      row,
      "<button onclick='deletePizza(this, " +
        pizza.id +
        ")' type='button'>Delete</button>"
    );

    event.preventDefault();
  }
}

document.getElementById("name").addEventListener("input", nameValidation);

function nameValidation(e) {
  if (!isUniqueName(e.target.value)) {
    document.getElementById("error").style.visibility = "visible";
    document.getElementById("button").disabled = true;
  } else {
    document.getElementById("error").style.visibility = "hidden";
    document.getElementById("button").disabled = false;
  }
}

function isUniqueName(name) {
  name = name.replace(/  +/g, " ").trim();
  let pizzas = [];
  if (sessionStorage.getItem("PizzaList") !== null) {
    pizzas = JSON.parse(sessionStorage.getItem("PizzaList"));
  } else {
    return true;
  }
  pizzas = pizzas.filter(function (obj) {
    return obj.name === name;
  });

  if (pizzas.length == 0) {
    return true;
  }
  return false;
}

function deletePizza(btn, id) {
  var result = confirm("Please confirm deletion");
  if (result) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    pizzas = JSON.parse(sessionStorage.getItem("PizzaList"));
    pizzas = pizzas.filter(function (obj) {
      return obj.id !== id;
    });
    sessionStorage.setItem("PizzaList", JSON.stringify(pizzas));
  }
}

function getList(arrayOfToppings) {
  if (arrayOfToppings.length > 1) {
    preparedString = arrayOfToppings[0];
    for (var i = 1; i < arrayOfToppings.length; i++) {
      preparedString = preparedString.concat(", " + arrayOfToppings[i]);
    }
    return preparedString;
  } else {
    return arrayOfToppings[0];
  }
}

function populateOverallOverview() {
  let pizzas = [];
  if (sessionStorage.getItem("PizzaList") !== null) {
    pizzas = JSON.parse(sessionStorage.getItem("PizzaList"));
  }

  var table = document.getElementById("menuTable");

  function addCell(tr, text) {
    var td = tr.insertCell();
    td.innerHTML = text;
    return td;
  }

  var tr = table.createTBody();

  pizzas.forEach(function (item) {
    const hotImage = getHotImage(item.heat);
    var row = tr.insertRow();
    addCell(row, "<img src='" + item.photo + "' width='120'>");
    addCell(row, item.name);
    addCell(row, hotImage);
    addCell(row, getList(item.toppings));
    addCell(row, item.price + " €");

    addCell(
      row,
      "<button onclick='deletePizza(this, " +
        item.id +
        ")' type='button'>Delete</button>"
    );
  });
}

var asc = true;
document.getElementById("thName").addEventListener("click", () => {
  sortTable(1);
  asc = !asc;
});

document.getElementById("thPrice").addEventListener("click", () => {
  sortTable(4);
  asc = !asc;
});

document.getElementById("thHeat").addEventListener("click", () => {
  sortTable(2);
  asc = !asc;
});

function getHotImage(value) {
  if (value == 1) {
    return "<img src='./img/mild.png' value='1' width='50'>";
  } else if (value == 2) {
    return "<img src='./img/hot.png' value='2' width='50'>";
  } else if (value == 3) {
    return "<img src='./img/burn.png' value='3' width='50'>";
  }
  return "";
}

function sortTable(index) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("menuTable");
  switching = true;
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("td")[index];
      y = rows[i + 1].getElementsByTagName("td")[index];
      if (index == 2) {
        var checkX = 0;
        var checkY = 0;
        if (typeof x.getElementsByTagName("img")[0] !== "undefined") {
          checkX = x.getElementsByTagName("img")[0].getAttribute("value");
        }
        if (typeof y.getElementsByTagName("img")[0] !== "undefined") {
          checkY = y.getElementsByTagName("img")[0].getAttribute("value");
        }
        console.log("x" + checkX + "x" + checkY);
        if (asc) {
          if (checkX > checkY) {
            shouldSwitch = true;
            break;
          }
        } else {
          if (checkX < checkY) {
            shouldSwitch = true;
            break;
          }
        }
      } else if (index == 4) {
        if (asc) {
          if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        } else {
          if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        }
      } else {
        if (asc) {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

document.getElementById("photo").addEventListener("change", previewPhoto);

function previewPhoto(e) {
  document.getElementById("previewImage").src = e.target.value;
}

document.getElementById("price").addEventListener("change", priceCheck);

function priceCheck(input) {
  if (input.target.value <= 0) {
    input.target.setCustomValidity("Value should be greater than zero.");
  } else {
    input.target.setCustomValidity("");
  }
}
