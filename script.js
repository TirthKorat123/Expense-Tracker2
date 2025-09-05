const form = document.getElementById("form");

form.addEventListener("submit", handleSubmit);

//handel the submit butten
function handleSubmit(event) {
    event.preventDefault();

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    let transaction = readData();
    transactions.push(transaction);

    //this line sort the all entry by date
    transactions = transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

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

    // ✅ NEW: attach the listeners each time you regenerate the list!
    document.getElementById("list").addEventListener("click", (e) => {
        //this part will delete one row from history
        if (e.target.classList.contains("delete-btn")) {
            const li = e.target.closest("li");
            const id = Number(li.getAttribute("index1"));
            let transactions = JSON.parse(localStorage.getItem("transactions"));
            transactions.splice(id, 1);
            localStorage.setItem("transactions", JSON.stringify(transactions));
            addTransactionHistory();
            console.log(id);
        }

        //this function is used to edit stored entries
        if (e.target.classList.contains("edit-btn")) {
            const li = e.target.closest("li");
            const id = Number(li.getAttribute("index1"));
            let transactions = JSON.parse(localStorage.getItem("transactions"));

            //this load the data into the form
            document.getElementById("text").value = transactions[id]["title"];
            document.getElementById("amount").value = transactions[id]["type"] === "income" ? transactions[id]["amount"] : (-transactions[id]["amount"]);
            document.getElementById("type").value = transactions[id]["type"];
            document.getElementById("category").value = transactions[id]["category"];
            document.getElementById("date").value = transactions[id]["date"];

            //this line change Add Transaction button into Update Transaction button
            document.getElementById("form-btn").innerHTML = "<button class='btn' type='button' id='update-btn'>Update Transaction</button>";

            //this code read data from form and update it in stored history
            document.getElementById("update-btn").addEventListener("click", () => {
                transactions[id] = readData();
                localStorage.setItem("transactions", JSON.stringify(transactions));
                addTransactionHistory();

                //this line change back to the Add Transaction from Update Transaction
                document.getElementById("form-btn").innerHTML = "<button class='btn' type='submit'>Add Transaction</button>";
            });
        }
    });
}


//this will add history when page load first time
window.addEventListener("DOMContentLoaded", addTransactionHistory);

// //this part will clear history on display and localstorage
// document.getElementById("clearBtn").addEventListener("click", () => {
//     localStorage.removeItem("transactions");
//     addTransactionHistory();
// })

// //this part will delete one row from history
// document.getElementById("list").addEventListener("click", (e) => {
//     if (e.target.classList.contains("delete-btn")) {
//         const li = e.target.closest("li");
//         const id = Number(li.getAttribute("index1"));
//         let transactions = JSON.parse(localStorage.getItem("transactions"));
//         transactions.splice(id, 1);
//         localStorage.setItem("transactions", JSON.stringify(transactions));
//         addTransactionHistory();
//         console.log(id);
//     }
// });

// //this function is used to edit stored entries
// document.getElementById("list").addEventListener("click", (e) => {
//     if (e.target.classList.contains("edit-btn")) {
//         const li = e.target.closest("li");
//         const id = Number(li.getAttribute("index1"));
//         let transactions = JSON.parse(localStorage.getItem("transactions"));

//         //this load the data into the form
//         document.getElementById("text").value = transactions[id]["title"];
//         document.getElementById("amount").value = transactions[id]["type"] === "income" ? transactions[id]["amount"] : (-transactions[id]["amount"]);
//         document.getElementById("type").value = transactions[id]["type"];
//         document.getElementById("category").value = transactions[id]["category"];
//         document.getElementById("date").value = transactions[id]["date"];

//         //this line change Add Transaction button into Update  Transaction button
//         document.getElementById("form-btn").innerHTML = "<button class='btn' type='button' id='update-btn'>Update Transaction</button>";

//         //this code read data from form and update it in stored history
//         document.getElementById("update-btn").addEventListener("click", () => {
//             transactions[id] = readData();
//             localStorage.setItem("transactions", JSON.stringify(transactions));
//             addTransactionHistory();

//             //this line change backto the Add Transaction from Update Transcation
//             document.getElementById("form-btn").innerHTML = "<button class='btn' type='submit'>Add Transaction</button>";
//         })
//     }
// });

document.getElementById("category-e-btn").addEventListener("click", () => {
    console.log("You have Entered Category wise Expense");

    let display = document.getElementById("right");
    display.innerHTML = "";

    // Create and insert back button
    const backButton = document.createElement("button");
    backButton.className = "btn back-btn";
    backButton.id = "backToHistoryBtn";
    backButton.textContent = "← Back to Transaction History";
    display.appendChild(backButton);

   backButton.addEventListener("click", () => {
    display.innerHTML = `
      <section class='history-section'>
        <div class='history-header'>
          <h3>Transaction History</h3>
          <button class='btn1' id='clearBtn'>clear history</button>
        </div>
        <ul id='list' class='transaction-list'></ul>
      </section>
    `;

    addTransactionHistory();

    // ✅ RE-BIND Clear History button
    document.getElementById("clearBtn").addEventListener("click", () => {
        localStorage.removeItem("transactions");
        addTransactionHistory();
    });
});


    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let category12 = ["food", "rent", "travel", "shopping", "other"];

    for (let i = 0; i < category12.length; i++) {
        let total_expense = 0;

        let expenses = transactions.filter(
            (transaction) =>
                transaction["category"] === category12[i] &&
                transaction["type"] === "expense"
        );

        expenses.forEach((transaction) => {
            total_expense += Math.abs(transaction["amount"]);
        });

        const card = document.createElement("div");
        card.className = "category-card";

        const title = document.createElement("h3");
        title.className = "category-title";
        title.textContent = category12[i].toUpperCase();

        const total = document.createElement("p");
        total.className = "category-total";
        total.textContent = `Total Expense: ₹${total_expense}`;

        card.appendChild(title);
        card.appendChild(total);

        if (expenses.length > 0) {
            const table = document.createElement("table");
            table.className = "category-table";

            const thead = document.createElement("thead");
            thead.innerHTML = `
                <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Title</th>
                </tr>`;
            table.appendChild(thead);

            const tbody = document.createElement("tbody");

            expenses.forEach((transaction) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${transaction["date"]}</td>
                    <td>₹${Math.abs(transaction["amount"])}</td>
                    <td>${transaction["title"]}</td>
                `;

                tbody.appendChild(row);
            });

            table.appendChild(tbody);
            card.appendChild(table);
        } else {
            const noTx = document.createElement("p");
            noTx.className = "no-transactions";
            noTx.textContent = "No expenses in this category.";
            card.appendChild(noTx);
        }

        display.appendChild(card);
    }
});


// setTimeout(() => {
//   const backBtn = document.getElementById("backToHistoryBtn");
//   if (backBtn) {
//     backBtn.addEventListener("click", () => {
//       document.getElementById("right").innerHTML = "";
//       addTransactionHistory();
//     });
//   }
// }, 0);
