// example {id:1592304983049, title: 'Deadpool', year: 2015}
const addPizza = (event) => {
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

    // event.preventDefault(); //to stop the form submitting
    let pizza = {
      id: Date.now(),
      name: document.getElementById("name").value,
      price: document.getElementById("price").value,
      heat: document.getElementById("heat").value,
      toppings: getList(document.getElementById("toppings").value),
      photo: document.getElementById("photo").value,
    };
    pizzas.push(pizza);
    document.querySelector("form").reset();

    //for display purposes only
    let pre = document.querySelector("#msg pre");
    pre.textContent = "\n" + JSON.stringify(pizzas, "\t", 2);
    //populateOverallOverview(pizzas);

    //saving to localStorage
    sessionStorage.setItem("PizzaList", JSON.stringify(pizzas));

    var table = document.getElementById("firstTabOverall");
    // helper function
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
    addCell(row, pizza.toppings);
    addCell(row, pizza.price + " €");
    addCell(
      row,
      "<button onclick='deletePizza(this, " +
        pizza.id +
        ")' type='button'>Delete</button>"
    );

    event.preventDefault();
  }
};
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("button").addEventListener("click", addPizza);
});

const input = document.getElementById("name");
input.addEventListener("input", nameValidation);

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

function getList(toppings) {
  var listOfToppings = "<ul>";
  var arrayOfToppings = toppings.split(" ");
  arrayOfToppings.forEach(function (item) {
    listOfToppings = listOfToppings.concat("<li>" + item + "</li>");
  });
  listOfToppings = listOfToppings.concat("</ul>");
  return listOfToppings;
}

function populateOverallOverview() {
  let pizzas = [];
  if (sessionStorage.getItem("PizzaList") !== null) {
    pizzas = JSON.parse(sessionStorage.getItem("PizzaList"));
  }

  var table = document.getElementById("firstTabOverall");
  // helper function
  function addCell(tr, text) {
    var td = tr.insertCell();
    td.innerHTML = text;

    return td;
  }

  // var headers = ["Name", "Price", "Heat", "Toppings", "Image", "Action"];

  // create header
  // var th = table.createTHead();
  // var headerRow = th.insertRow();
  // headers.forEach((element) => {
  //   th = document.createElement("th");
  //   th.id = "th" + element;
  //   th.innerHTML = element;
  //   headerRow.appendChild(th);
  // });

  // addCell(headerRow, "Name");
  // addCell(headerRow, "Price");
  // addCell(headerRow, "Heat");
  // addCell(headerRow, "Toppings");
  // addCell(headerRow, "Image");
  // addCell(headerRow, "Action");

  // insert data
  var tr = table.createTBody();

  pizzas.forEach(function (item) {
    const hotImage = getHotImage(item.heat);
    var row = tr.insertRow();
    addCell(row, "<img src='" + item.photo + "' width='120'>");
    addCell(row, item.name);
    addCell(row, hotImage);
    addCell(row, item.toppings);
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
const thName = document.getElementById("thName");
thName.addEventListener("click", () => {
  sortTable(1);
  asc = !asc;
});
const thPrice = document.getElementById("thPrice");
thPrice.addEventListener("click", () => {
  sortTable(4);
  asc = !asc;
});

const thHeat = document.getElementById("thHeat");
thHeat.addEventListener("click", () => {
  sortTable(2);
  asc = !asc;
});

// const thPrice = document.getElementById("thHeat");
// thPrice.addEventListener("input", nameValidation);

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
  table = document.getElementById("firstTabOverall");
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < rows.length - 1; i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("td")[index];
      y = rows[i + 1].getElementsByTagName("td")[index];
      // Check if the two rows should switch place:
      if (index == 2) {
        if (asc) {
          if (
            x.getElementsByTagName("img")[0].getAttribute("value") >
            y.getElementsByTagName("img")[0].getAttribute("value")
          ) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else {
          if (
            x.getElementsByTagName("img")[0].getAttribute("value") <
            y.getElementsByTagName("img")[0].getAttribute("value")
          ) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      } else if (index == 4) {
        if (asc) {
          if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else {
          if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      } else {
        if (asc) {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}
