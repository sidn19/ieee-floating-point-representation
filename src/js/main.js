const data = () => ({
  disableDoubleUp: true,
  disableDoubleDown: true,
  disableDown: true,
  section: 0,
  multiplicand: null,
  multiplier: null,
  ieeeMultiplicand: [],
  ieeeMultiplier: [],
  previousSection() {
    if (this.section > 0) {
      this.section -= 1;
    }
  },
  nextSection() {
    if (!this.disableDown) {
      if (this.section === 0) {
        this.ieeeMultiplicand = decimalToIEEE(this.multiplicand);
        this.ieeeMultiplier = decimalToIEEE(this.multiplier);
      }
      this.section += 1;
    }
  }
})

singlePrecisionMultipy('01000100000011110010010101011111'.split('').map(val => parseInt(val)), '01000010000100011110110101101010'.split('').map(val => parseInt(val)));

function resolveOverflow(bits) {
  let overflowBit = 0;
  for(let i = bits.length - 1; i >= 0; --i) {
    if (bits[i] >= 2) {
      if (i != 0) {
        bits[i - 1] += Math.floor(bits[i] / 2);
      }
      else {
        overflowBit = 1;
      }
      bits[i] %= 2;
    }
  }
  return overflowBit;
}

function bitwiseAddition(bits1, bits2) {
  for(let i = bits2.length - 1; i >= 0; --i) {
  	bits1[i] += bits2[i];
  }
  return resolveOverflow(bits1);
}

function bitwiseSubtraction(bits1, bits2) {
  // get two's complement of array 2
	let i;
	// temp array
	let temp = new Array(bits2.length);
	for(i = 0; i < bits2.length; ++i) {
		temp[i] = bits2[i];
	}
	for(i = 0; i < temp.length; ++i) {
		temp[i] = temp[i] == 0 ? 1 : 0;
	}
	// add 1
	temp[temp.length - 1] += 1;
	resolveOverflow(temp);
	return bitwiseAddition(bits1, temp);
}

function bitwiseMultiplication(bits1, bits2) {
  let answer = new Array(bits1.length + bits2.length).fill(0);
  let rows = new Array(bits2.length);
  for(let i = 0; i < rows.length; ++i) {
    rows[i] = new Array(bits1.length + bits2.length).fill(0);
  }

  for(let i = bits2.length - 1; i >= 0; --i) {
    for(let j = bits1.length - 1; j >= 0; --j) {
      // bitwise and
      if (bits1[j] === 1 && bits2[i] === 1) {
        rows[bits2.length - i - 1][i + j + 1] = 1;
      }
    }
  }
  // add rows
  for(let i = 0; i < answer.length; ++i) {
    for(let j = 0; j < rows.length; ++j) {
      answer[i] += rows[j][i];
    }
  }
  resolveOverflow(answer);
  return answer;
}

function singlePrecisionMultipy(float1, float2) {
  let answer = new Array(32).fill(0);
  // checking signed bits
  if (float1[0] != float2[0]) {
    answer[0] = 1;
  }
  // add exponents then subtract bias
  let temp = new Array(8).fill(0);
  for(let i = 1; i < 9; ++i) {
    temp[i - 1] = float1[i];
  }
  bitwiseAddition(temp, float2.slice(1, 9));
  bitwiseSubtraction(temp, [0, 1, 1, 1, 1, 1, 1, 1]);
  // store in answer
  for(let i = 1; i < 9; ++i) {
    answer[i] = temp[i - 1];
  }
  temp = bitwiseMultiplication(float1.slice(9), float2.slice(9));
  // normalize temp
  let addedExponent = 0;
  for(let i = temp.length - 1; i >= 0; --i) {

  }
  /*
  for(let i = 9; i < answer.length; ++i) {
    answer[i] = temp[i];
  }
  console.log(answer);
  */
}

function decimalToIEEE(num) {
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
