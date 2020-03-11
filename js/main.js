var num
function populateInputs() {
	num = parseFloat(document.getElementById('decimal-number').value);
	str += '<button onclick="DectoBin()">Get Binary</button>';
	main.innerHTML = str;
}

function DectoBin(num) {
	var floatpart;
	var intpart;
	var intoffloatpart = 0;
	var arr[20];
	var temp;
	var i;
	var j;
	var k;
	var count=0;
	
	parseInt(intpart = num);
	floatpart = num - intpart;
	
	while(intpart != 0) {
		temp = intpart % 2;
		intpart /= 2;
		arr[i] = temp; 
		count = count + 1;
		i++;
	}
	
	for(j = count - 1; j >= 0; j--) {
		document.write(arr[j]),innerHTML;
	}
	
	document.write(".").innerHTML;
	
	for(k=1; k<=8; k++){
		floatpart = floatpart * 2;
		parseInt(intoffloatpart = floatpart);
		document.write(intoffloatpart).innerHTML;
		if(intoffloatpart == 1)
		floatpart=floatpart - intoffloatpart;
	}

}
