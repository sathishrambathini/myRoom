function viewDetails(id){
    let url = `https://fifthfloor.herokuapp.com/userDetails/${id}`
    fetch(url,
    {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin':'*'
        }
    }
    )
    .then(response => response.json())
    .then(data => {
        document.getElementById('innerBody').style.display = 'none';
        document.getElementById('details').style.display = 'block';
        if(data){
            let resHtml = ``;
            for (let i = 0; i < data.length; i++) {
                resHtml  = resHtml + `<div class="detail">
                    <div class="innerDetails">
                        <p>Product : ${data[i].itemName},</p>
                        <p>Purpose : ${data[i].description},</p>
                        <p>amount : ${data[i].amount}/-.</p>
                    </div>
                    <p>buy date : ${data[i].createdDate}</p>
                </div>`;
            }
            resHtml = `<button class="btn-pr btn-bck" onclick="goBackFromDetails()">Back</button>`+resHtml;
            document.getElementById("details").innerHTML = resHtml;
        }
    });
}
var userId;
function addNewProd(id){
    userId = id;
    document.getElementById('innerBody').style.display = 'none';
    document.getElementById('form').style.display = 'block';
}
function onLoad(){
    if(window.localStorage.getItem('userId')){
        document.getElementById('form-login').style.display = 'none';
        document.getElementById('signed-in').style.display = 'block';
        document.getElementById("pro-pic-pro").src = window.localStorage.getItem('img');
        document.getElementById("name-pro").innerHTML = window.localStorage.getItem('name');
        fetch('https://fifthfloor.herokuapp.com/fetchAllUsers',
        {
            mode: 'cors',
            headers: {
              'Access-Control-Allow-Origin':'*'
            }
        }
        )
        .then(response => response.json())
        .then(data =>{
            if(data){
                // var wholeData = ;
                var resHtml = ``;
                var btn = `<button class="btn-pr logout" onclick="logout()">Log Out</button>`;
                // var addButton = `<button class="btn-pr two-btn" onclick="addNewProd(${data[i].userId})">+ Add</button>`;
                for (let i = 0; i < data.length; i++) {
                    if(window.localStorage.getItem('userId') == data[i].userId){
                        resHtml = resHtml+`<div class="item">
                        <div>
                        <img class="pro-pic-1" src="${data[i].img}" height="120" width="120"/>
                        <div class="name-ele">
                            <p class="name">
                                ${data[i].userName}
                            </p>
                        </div>
                        </div>
                        <div class="details">
                            <p class"i-d">Total : &#x20b9; ${data[i].totalAmount}/-</p>
                            <p class"i-d">Paid : &#x20b9; ${data[i].spentAmount}/-</p>
                            <p class"i-d">Due : &#x20b9; ${data[i].totalAmount - data[i].spentAmount}/-</p>
                        </div>
                        <div class="btns">
                            <button class="btn-pr two-btn" onclick="viewDetails(${data[i].userId})">View Details</button>`+`<button class="btn-pr two-btn" onclick="addNewProd(${data[i].userId})">+ Add</button>
                        </div>
                        </div>`;
                    }
                    else{
                        resHtml = resHtml+`<div class="item">
                        <div>
                        <img class="pro-pic-1" src="${data[i].img}" height="120" width="120"/>
                        <div class="name-ele">
                            <p class="name">
                                ${data[i].userName}
                            </p>
                        </div>
                        </div>
                        <div class="details">
                            <p>Total Amount : &#x20b9; ${data[i].totalAmount}/-</p>
                            <p>Paid Amount : &#x20b9; ${data[i].spentAmount}/-</p>
                            <p>Due Amount : &#x20b9; ${data[i].totalAmount - data[i].spentAmount}/-</p>
                        </div>
                        <div class="btns">
                            <button class="btn-pr two-btn" onclick="viewDetails(${data[i].userId})">View Details</button>
                        </div>
                        </div>`
                    } 
                }
                document.getElementById('innerBody').innerHTML = btn+resHtml;
                goBack();
            }
        });
    }
}
function goBackFromDetails(){
    document.getElementById('details').style.display = 'none';
    document.getElementById('innerBody').style.display = 'block';    
}
function goBack(){
    document.getElementById('itemName').value = "";
    document.getElementById('description').value = "";
    document.getElementById('amount').value = "";
    document.getElementById('createdDate').value = "";
    document.getElementById('form').style.display = 'none';
    document.getElementById('innerBody').style.display = 'block';
}
function saveForm(){
    document.getElementById('saveBtn').disabled = true;
    let formObj = {
            userId : "",
            itemName : "",
            description : "",
            amount : "",
            createdDate : ""
    }
    formObj.userId = parseInt(userId);
    // formObj.id = 1;
    formObj.itemName = document.getElementById('itemName').value;
    formObj.description = document.getElementById('description').value;
    formObj.amount = parseInt(document.getElementById('amount').value);
    formObj.createdDate = document.getElementById('createdDate').value;
    if(formObj.userId && formObj.itemName && formObj.description && formObj.amount && formObj.createdDate){
        fetch("https://fifthfloor.herokuapp.com/insertProductDetails",
        {
            mode: 'cors',
            headers: {
              'Access-Control-Allow-Origin':'*',
              'Content-Type' : 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(formObj)
        },
        )
        .then(response => response.json())
        .then(response => {
            document.getElementById('saveBtn').disabled = false;
            onLoad();
        })
    }
    else{
        document.getElementById('saveBtn').disabled = false;
        alert("Please fill valid details");
    }
}
function login(){
        let formObj = {
            "emailId" : "",
            "password" : ""
        }
        formObj.emailId = document.getElementById('email').value;
        formObj.password = document.getElementById('password').value;
        if(formObj.emailId && formObj.password){
            fetch("https://fifthfloor.herokuapp.com/validUser",
            {
                mode: 'cors',
                headers: {
                  'Access-Control-Allow-Origin':'*',
                  'Content-Type' : 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(formObj)
            },
            )
            .then(response => response.json())
            .then(response => {
                // console.log("response",response)
                window.localStorage.setItem('userId',response.userId);
                window.localStorage.setItem('img',response.img);
                window.localStorage.setItem('name',response.userName);
                document.getElementById('form-login').style.display = 'none';
                document.getElementById('signed-in').style.display = 'block';
                document.getElementById("pro-pic-pro").src = response.img;
                document.getElementById("name-pro").innerHTML = response.userName;
                onLoad();
            })
        }
}
function logout(){
    window.localStorage.removeItem('email');
    window.localStorage.removeItem('img');
    window.localStorage.removeItem('userId');
    document.getElementById('signed-in').style.display = 'none';
    document.getElementById('form-login').style.display = 'block';
}