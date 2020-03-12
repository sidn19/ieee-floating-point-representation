function decimalToBinary() {
	var num = parseFloat(document.getElementById('decimal-number').value);
	var intPart = Math.floor(num);
	var floatPart = num - intPart;
	var ieeRep = new Array(32).fill(0);
	var i = 0;
	var tempNum = [];
	var tempNum2 = [];
	// sign bit
	ieeRep[i++] = num < 0 ? 1 : 0;
	// getting number in its entirety
	while(intPart > 0) {
		tempNum.push(intPart % 2);
		intPart = Math.floor(intPart / 2);
	}
	// reverse
	tempNum.reverse();

	for(let j = 0; j < 7; ++j) {
		floatPart *= 2;
		tempNum2.push(floatPart >= 1 ? 1 : 0);
		floatPart = floatPart >= 1 ? 1 - floatPart : floatPart;
	}
	console.log(tempNum);
	console.log(tempNum2);
}

function DectoBin() {
	var num = parseFloat(document.getElementById('decimal-number').value);
	var floatpart;
	var intpart;
	var intoffloatpart = 0;
	var arr = new Array(20);
	var temp;
	var i;
	var j;
	var k;
	var count=0;

	intpart = parseInt(num);
	floatpart = num - intpart;

	while(intpart != 0) {
		temp = intpart % 2;
		intpart /= 2;
		arr[i] = temp;
		count = count + 1;
		i++;
	}

	for(j = count - 1; j >= 0; j--) {
		document.write(arr[j]);
	}

	document.write(".");

	for(k=1; k<=8; k++){
		floatpart = floatpart * 2;
		intoffloatpart = parseInt(floatpart);
		document.write(intoffloatpart);
		if(intoffloatpart == 1)
		floatpart=floatpart - intoffloatpart;
	}

}
