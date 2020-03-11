singlePrecisionMultipy('01000100000011110010010101011111'.split(''), '01000010000100011110110101101010'.split(''));

function resolveOverflow(bits) {
  let overflowBit = 0;
  for(let i = bits.length - 1; i >= 0; --i) {
    if (bits[i] == 2) {
      // overflow
      bits[i] = 0;
      if (i != 0) {
        bits[i - 1] += 1;
      }
      else {
        overflowBit = 1;
      }
    }
    else if (bits[i] == 3) {
      // overflow
      bits[i] = 1;
      if (i != 0) {
        bits[i - 1] += 1;
      }
      else {
        overflowBit = 1;
      }
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
  let rows = new Array(bits2.length).fill(new Array(bits1.length + bits2.length).fill(0));
  for(let i = bits1.length - 1; i >= 0; --i) {
    for(let j = bits2.length - 1; j >= 0; --j) {
      // bitwise and
      rows[i][i + j] = bits1[i] & bits2[j];
    }
  }
  // add rows
  for(let i = 0; i < answer.length; ++i) {
    for(let j = 0; j < rows.length; ++j) {
      answer[i] += rows[j][i];
    }
  }
  // TODO: resolve overflow
  
  return answer;
}

function singlePrecisionMultipy(float1, float2) {
  let answer = new Array(32).fill(0);
  // checking signed bits
  if (float1[0] == float2[0]) {
    answer[0] = 0;
  }
  // add exponents then subtract bias
  if(bitwiseAddition(float1.slice(1, 9), float2.slice(1, 9))) {
    alert('Exponent overflow!');
  }
  else bitwiseSubtraction(temp, [0, 1, 1, 1, 1, 1, 1, 1]);

}
