const form = document.getElementById("form");

form.addEventListener("submit", handleSubmit);

//handel the submit butten
function handleSubmit(event) {
    event.preventDefault();

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let transaction = readData();
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    console.log(transactions);
    addTransactionHistory();
}

//read or fatch data from form and return that in form of object
function readData() {
    let title = document.getElementById("text").value;
    let amount = document.getElementById("amount").value;
    let type = document.getElementById("type").value;
    let category = document.getElementById("category").value;
    let date = document.getElementById("date").value;

    //for setting nagetive value of when type is expense
    if (type == "expense") {
        amount = (-amount);
    } else {
        amount = (+amount);
    }

    return {
        "title": title,
        "amount": amount,
        "type": type,
        "category": category,
        "date": date
    }
}

//this function will add transation history at right side
function addTransactionHistory() {
    let history = document.getElementById("list");
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    
    //this will clear all history for not display double entries
    history.innerHTML = "";
    let sum = 0;
    let income = 0;
    let expense = 0;

    //this will add one row in history every loop
    transactions.forEach((transaction, index) => {

        let entry = `<li class='${transaction["type"]}' index1='${index}'>
            <span class='text'>${transaction["title"]}</span>
            <span class='amount'>${transaction["amount"]}</span>
            <span class='date'>${transaction["date"]}</span>
            <button class='edit-btn'>Edit</button>
            <button class='delete-btn'>x</button>
        </li>`;
        history.innerHTML += entry;

        //this calculate totle balance after income and expense
        sum += transaction["amount"];
        document.getElementById("balance").innerHTML = `₹ ${sum}.00`;

        //this will calculate income and expense seprately and displays it
        if (transaction["type"] == "income") {
            income += transaction["amount"];
        } else {
            expense += transaction["amount"];
        }
        document.getElementById("money-plus").innerHTML = `₹ ${income}.00`;
        document.getElementById("money-minus").innerHTML = `₹ ${expense}.00`;

    });
}

//this will add history when page load first time
window.addEventListener("DOMContentLoaded", addTransactionHistory);

//this part will clear history on display and localstorage
document.getElementById("clearBtn").addEventListener("click", () => {
    localStorage.removeItem("transactions");
    addTransactionHistory();
})

//this part will delete one row from history
document.getElementById("list").addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const li = e.target.closest("li");
        const id = Number(li.getAttribute("index1"));
        let transactions = JSON.parse(localStorage.getItem("transactions"));
        transactions.splice(id, 1);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        addTransactionHistory();
        console.log(id);
    }
});

//this function is used to edit stored entries
document.getElementById("list").addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
        const li = e.target.closest("li");
        const id = Number(li.getAttribute("index1"));
        let transactions = JSON.parse(localStorage.getItem("transactions"));

        //this load the data into the form
        document.getElementById("text").value = transactions[id]["title"];
        document.getElementById("amount").value = transactions[id]["type"]==="income"?transactions[id]["amount"]:(-transactions[id]["amount"]);
        document.getElementById("type").value = transactions[id]["type"];
        document.getElementById("category").value = transactions[id]["category"];
        document.getElementById("date").value = transactions[id]["date"];
        
        //this line change Add Transaction button into Update  Transaction button
        document.getElementById("form-btn").innerHTML="<button class='btn' type='button' id='update-btn'>Update Transaction</button>";

        //this code read data from form and update it in stored history
        document.getElementById("update-btn").addEventListener("click", () => {
            transactions[id]=readData();
            localStorage.setItem("transactions", JSON.stringify(transactions));
            addTransactionHistory();

            //this line change backto the Add Transaction from Update Transcation
            document.getElementById("form-btn").innerHTML="<button class='btn' type='submit'>Add Transaction</button>";
        })
    }
});