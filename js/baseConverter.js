var num
function populateInputs() {
	num = parseInt(document.getElementById('decimal-number').value);
	str += <button onclick="DectoBin()">Get Binary</button>;
	main.innerHTML = str;
}

function DectoBin(num) {
	var a = [];
	for(i=0;n>0;i++) {    
		a[i]=n%2;    
		n=n/2;    
	}
	var iterator = a.values(); 
  
// All the elements of the array the array  
// is being printed. 
console.log(iterator.next().value); 
console.log(iterator.next().value); 
console.log(iterator.next().value); 
console.log(iterator.next().value); 

	document.getElementById('output-div').innerHTML = str;
}

