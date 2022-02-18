var addrect = document.querySelector("#addrect");
var addbtn = document.querySelector("#addbtn");
addbtn.addEventListener('click', function () {
	if (addrect.style.display == "none") {
		addrect.style.display = "block";
	}
	else {
		addrect.style.display = "none";
	}
})