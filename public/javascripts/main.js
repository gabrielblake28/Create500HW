let movieArray = [];

// define a constructor to create movie objects

let OrderObject = function (storeID, salesPersonID, cdID, pricePaid, date) {
  this.StoreID = storeID;
  this.SalesPersonID = salesPersonID;
  this.CdID = cdID;
  this.PricePaid = pricePaid;
  this.Date = date;
};

let selectedGenre = "not selected";

document.addEventListener("DOMContentLoaded", function () {
  createList();

  // add button events ************************************************************************

  document.getElementById("buttonGet").addEventListener("click", function () {
    createList();
  });

  document
    .getElementById("buttonDelete")
    .addEventListener("click", function () {
      deleteMovie(document.getElementById("deleteID").value);
    });

  document.getElementById("buttonClear").addEventListener("click", function () {
    document.getElementById("title").value = "";
    document.getElementById("year").value = "";
  });

  $(document).bind("change", "#select-genre", function (event, ui) {
    selectedGenre = $("#select-genre").val();
  });
});
// end of wait until document has loaded event  *************************************************************************

async function createList() {
  // update local array from server

  await fetch("/getAllOrders")
    // Handle success
    .then((response) => response.json()) // get the data out of the response object
    .then((responseData) => fillUL(responseData)) //update our array and li's
    .catch((err) => console.log("Request Failed", err)); // Catch errors
}

function fillUL(data) {
  // clear prior data
  var divMovieList = document.getElementById("divMovieList");
  while (divMovieList.firstChild) {
    // remove any old data so don't get duplicates
    divMovieList.removeChild(divMovieList.firstChild);
  }

  var ul = document.createElement("ul");
  movieArray = data;
  console.log(data);
  movieArray.forEach(function (element) {
    // use handy array forEach method
    console.log("hi");
    var li = document.createElement("li");
    li.innerHTML =
      element.StoreID +
      ":  &nbsp &nbsp  &nbsp &nbsp " +
      element.SalesPersonID +
      "  &nbsp &nbsp  &nbsp &nbsp " +
      element.CdID +
      " &nbsp &nbsp  &nbsp &nbsp  " +
      element.PricePaid +
      " &nbsp &nbsp  &nbsp &nbsp  " +
      element.Date;
    ul.appendChild(li);
  });
  divMovieList.appendChild(ul);
}

function deleteMovie(ID) {
  fetch("/DeleteMovie/" + ID, {
    method: "DELETE",
    // body: JSON.stringify(_data),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch((err) => console.log(err));
}

function CreateVals() {
  function getSalesPersonID(num) {
    let personID = {
      98053: [1, 2, 3, 4],
      98007: [5, 6, 7, 8],
      98077: [9, 10, 11, 12],
      98055: [13, 14, 15, 16],
      98011: [17, 18, 19, 20],
      98046: [21, 22, 23, 24],
    };

    return personID[num][Math.floor(Math.random() * personID[num].length)];
  }

  let storeIDs = [98053, 98007, 98077, 98055, 98011, 98046];
  let cdIDs = [
    123456, 123654, 321456, 321654, 654123, 654321, 543216, 354126, 621453,
    623451,
  ];

  const storeIndex = Math.floor(Math.random() * storeIDs.length);
  const cdIndex = Math.floor(Math.random() * cdIDs.length);

  document.getElementById("storeId").value = storeIDs[storeIndex];
  document.getElementById("salesId").value = getSalesPersonID(
    document.getElementById("storeId").value
  );
  document.getElementById("cdId").value = cdIDs[cdIndex];
  document.getElementById("pricePaid").value = Math.floor(
    Math.random() * (15 - 5 + 1) + 5
  );
  document.getElementById("date").value = `${new Date().toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} - ${new Date().toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "numeric",
  })}`;
}

function SubmitOne() {
  let storeId = document.getElementById("storeId").value;
  let salesPersonId = document.getElementById("salesId").value;
  let cdId = document.getElementById("cdId").value;
  let pricePaid = document.getElementById("pricePaid").value;
  let date = document.getElementById("date").value;

  const newOrder = new OrderObject(
    storeId,
    salesPersonId,
    cdId,
    pricePaid,
    date
  );

  fetch("/AddOrder", {
    method: "POST",
    body: JSON.stringify(newOrder),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) => response.json())
    .then((json) => console.log(json), createList())
    .catch((err) => console.log(err));
}

async function Submit500() {
  let count = 500;
  let orders = [];

  while (count > 0) {
    CreateVals();
    let storeId = document.getElementById("storeId").value;
    let salesPersonId = document.getElementById("salesId").value;
    let cdId = document.getElementById("cdId").value;
    let pricePaid = document.getElementById("pricePaid").value;
    let date = document.getElementById("date").value;

    if (count < 500) {
      date = AddMinutesToDate();
    }

    const newOrder = new OrderObject(
      storeId,
      salesPersonId,
      cdId,
      pricePaid,
      date
    );

    orders.push(newOrder);
    count--;
    console.log(count);

    const result = await fetch("/Submit500", {
      method: "POST",
      body: JSON.stringify(newOrder),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
  }

  console.log(orders);
}

function AddMinutesToDate() {
  let now = new Date();
  let random = Math.random() * (1440 - 5 + 1) + 5;

  return `${new Date().toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} - ${new Date(now.getTime() + random * 60000).toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "numeric",
  })}`;
}
function getAllLessThan10() {
  // update local array from server

  let store = document.getElementById("storeId").value;

  console.log(store);

  fetch("/getAllLessThan10/" + store, {
    method: "GET",
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) => response.json()) // get the data out of the response object
    .then((responseData) => fillUL(responseData)) //update our array and li's
    .catch((err) => console.log("Request Failed", err)); // Catch errors
}

function getAll5Dollars() {
  let salesID = document.getElementById("salesId").value;
  let price = document.getElementById("pricePaid").value;

  fetch("/getAllFromSalesMan/" + salesID + "/" + price, {
    method: "GET",
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) => response.json()) // get the data out of the response object
    .then((responseData) => fillUL(responseData)) //update our array and li's
    .catch((err) => console.log("Request Failed", err)); // Catch errorss
}
