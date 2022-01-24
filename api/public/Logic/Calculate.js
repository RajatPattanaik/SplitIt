function share(){
    const expense = document.querySelector("#expense").value;
    const members = document.querySelector("#members").value;
    const share = expense/members;
    document.querySelector("#share").innerHTML = share;
}