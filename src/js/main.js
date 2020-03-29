const data = () => ({
  disableDoubleUp: true,
  disableDoubleDown: true,
  disableDown: true,
  section: 0,
  multiplicand: {
    input: null,
    error: false,
    temp: [],
    binaryString: '',
    normalizedString: '',
    exponent: 0,
    biasedExponent: 0,
    exponentBinary: [],
    exponentBinaryString: '',
    ieee: []
  },
  multiplier: {
    input: null,
    error: false,
    temp: [],
    binaryString: '',
    normalizedString: '',
    exponent: 0,
    biasedExponent: 0,
    exponentBinary: [],
    exponentBinaryString: '',
    ieee: []
  },
  equalsZero: false,
  ieee: new Array(32).fill(0),
  decimalResult: 0,
  exponentOverflow: false,
  exponentUnderflow: false,
  mantissaOverflow: false,
  firstSection() {
    if (!this.disableDoubleUp) {
      this.disableDown = false;
      this.disableDoubleUp = true;
      this.section = 0;
    }
  },
  previousSection() {
    if (this.section > 0) {
      this.section -= 1;
      this.disableDown = false;
      if (this.section === 0) {
        this.disableDoubleUp = true;
      }
    }
  },
  nextSection() {
    this.disableDoubleUp = false;
    if (!this.disableDown) {
      if (this.section === 0) {
        // convert to binary
        this.multiplicand.temp = decimalToBinary(this.multiplicand.input);
        this.multiplier.temp = decimalToBinary(this.multiplier.input);

        //convert to string
        if (this.multiplicand.temp.characteristic.length > 23) {
          this.multiplicand.binaryString = `${(this.multiplicand.temp.sign === 0 ? '' : '-') + this.multiplicand.temp.characteristic.join('').slice(0, 23)}...`;
        }
        else {
          this.multiplicand.binaryString = `${(this.multiplicand.temp.sign === 0 ? '' : '-') + this.multiplicand.temp.characteristic.join('')}.${this.multiplicand.temp.mantissa.join('').slice(0, 23 - this.multiplicand.temp.characteristic.length)}...`;
        }
        if (this.multiplier.temp.characteristic.length > 23) {
          this.multiplier.binaryString = `${(this.multiplier.temp.sign === 0 ? '' : '-') + this.multiplier.temp.characteristic.join('').slice(0, 23)}...`;
        }
        else {
          this.multiplier.binaryString = `${(this.multiplier.temp.sign === 0 ? '' : '-') + this.multiplier.temp.characteristic.join('')}.${this.multiplier.temp.mantissa.join('').slice(0, 23 - this.multiplier.temp.characteristic.length)}...`;
        }
      }
      else if (this.section === 1) {
        // normalize
        this.multiplicand.temp = normalizeBinary(this.multiplicand.temp);
        this.multiplier.temp = normalizeBinary(this.multiplier.temp);
        this.multiplier.exponent = this.multiplier.temp.exponent;
        this.multiplicand.exponent = this.multiplicand.temp.exponent;

        // convert to string
        this.multiplicand.normalizedString = `${(this.multiplicand.temp.sign === 0 ? '' : '-') + this.multiplicand.temp.characteristic}.${this.multiplicand.temp.mantissa.join('')}`;
        this.multiplier.normalizedString = `${(this.multiplier.temp.sign === 0 ? '' : '-') + this.multiplier.temp.characteristic}.${this.multiplier.temp.mantissa.join('')}`;

        // add bias
        this.multiplicand.biasedExponent = 127 + this.multiplicand.exponent;
        this.multiplier.biasedExponent = 127 + this.multiplier.exponent;

        // convert to binary
        this.multiplicand.exponentBinary = decimalToBinary(this.multiplicand.biasedExponent);
        this.multiplier.exponentBinary = decimalToBinary(this.multiplier.biasedExponent);

        // make it 8 bit long
        if (this.multiplicand.exponentBinary.characteristic.length <= 8 && this.multiplicand.exponentBinary.sign === 0) {
          this.multiplicand.exponentBinary.characteristic = new Array(8 - this.multiplicand.exponentBinary.characteristic.length).fill(0).concat(this.multiplicand.exponentBinary.characteristic);
          // convert to string
          this.multiplicand.exponentBinaryString = this.multiplicand.exponentBinary.characteristic.join('');
        }
        else {
          this.disableDown = true;
          if (this.multiplicand.exponentBinary.sign === 1) {
            this.multiplicand.exponentBinaryString = 'Exponent Underflow';
          }
          else {
            this.multiplicand.exponentBinaryString = 'Exponent Overflow';
          }
        }
        if (this.multiplier.exponentBinary.characteristic.length <= 8 && this.multiplier.exponentBinary.sign === 0) {
          this.multiplier.exponentBinary.characteristic = new Array(8 - this.multiplier.exponentBinary.characteristic.length).fill(0).concat(this.multiplier.exponentBinary.characteristic);
          // convert to string
          this.multiplier.exponentBinaryString = this.multiplier.exponentBinary.characteristic.join('');
        }
        else {
          this.disableDown = true;
          if (this.multiplier.exponentBinary.sign === 1) {
            this.multiplier.exponentBinaryString = 'Exponent Underflow';
          }
          else {
            this.multiplier.exponentBinaryString = 'Exponent Overflow';
          }
        }
      }
      else if (this.section === 2) {
        this.multiplicand.ieee = [this.multiplicand.temp.sign].concat(this.multiplicand.exponentBinary.characteristic).concat(this.multiplicand.temp.mantissa);
        this.multiplier.ieee = [this.multiplier.temp.sign].concat(this.multiplier.exponentBinary.characteristic).concat(this.multiplier.temp.mantissa);
      }
      else if (this.section === 3) {
        if (checkZero(this.multiplicand.ieee) || checkZero(this.multiplier.ieee)) {
          this.equalsZero = true;
          this.disableDoubleDown = true;
          this.disableDown = true;
        }
        else {
          this.equalsZero = false;
          this.disableDoubleDown = false;
          this.disableDown = false;
        }
      }
      else if (this.section === 4) {
        if (this.multiplicand.ieee[0] === this.multiplier.ieee[0]) {
          this.ieee[0] = 0;
        }
        else {
          this.ieee[0] = 1;
        }
      }
      else if (this.section === 5) {
        if (this.multiplicand.biasedExponent + this.multiplier.biasedExponent - 127 > 255) {
          // exponent overflow
          this.exponentOverflow = true;
          this.exponentUnderflow = false;
          this.disableDown = true;
          this.disableDoubleDown = true;
        }
        else if (this.multiplicand.biasedExponent + this.multiplier.biasedExponent - 127 < 0) {
          // exponent underflow
          this.exponentUnderflow = true;
          this.exponentOverflow = false;
          this.disableDown = true;
          this.disableDoubleDown = true;
        }
        else {
          this.exponentUnderflow = false;
          this.exponentOverflow = false;
          // add exponents then subtract bias
          let temp = new Array(8).fill(0);
          for(let i = 1; i < 9; ++i) {
            temp[i - 1] = this.multiplicand.ieee[i];
          }
          bitwiseAddition(temp, this.multiplier.ieee.slice(1, 9));
          bitwiseSubtraction(temp, [0, 1, 1, 1, 1, 1, 1, 1]);

          for(let i = 1; i < 9; ++i) {
            this.ieee[i] = temp[i - 1];
          }
        }
      }
      else if (this.section === 6) {
        let temp = bitwiseMultiplication([1].concat(this.multiplicand.ieee.slice(9)), [1].concat(this.multiplier.ieee.slice(9)));
        this.mantissaOverflow = temp[0] === 1;
        if (this.mantissaOverflow) {
          // adding 1 to exponent
          let temp2 = this.ieee.slice(1, 9);
          bitwiseAddition(temp2, [0, 0, 0, 0, 0, 0, 0, 1]);
          for(let i = 1; i < 9; ++i) {
            this.ieee[i] = temp2[i - 1];
          }
          // ignore first bit of temp
          for(let i = 9; i < 32; ++i) {
            this.ieee[i] = temp[i - 8];
          }
        }
        else {
          // ignore first two bits of temp
          for(let i = 9; i < 32; ++i) {
            this.ieee[i] = temp[i - 7];
          }
        }
      }
      else if (this.section === 7) {
        this.decimalResult = ieeeToDecimal(this.ieee);
      }
      this.section += 1;
    }
  },
  validateInput(type) {
    // validate if input is a number
    this[type].error = isNaN(parseFloat(this[type].input)) || !isFinite(this[type].input);
    this.disableDown = this.multiplicand.input == null || this.multiplier.input == null || this.multiplicand.error || this.multiplier.error;
  }
});

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

function decimalToBinary(num) {
  var negative = num < 0;
  var tempNum = [];
  var tempNum2 = [];

  if (!negative) {
    var intPart = Math.floor(num);
  	var floatPart = num - intPart;
  }
  else {
    var intPart = Math.ceil(num);
  	var floatPart = Math.abs(num - intPart);
  }


  intPart = Math.abs(intPart);
	if (intPart >= 1) {
    while(intPart > 0) {
  		tempNum.push(intPart % 2);
  		intPart = Math.floor(intPart / 2);
  	}
  	// reverse
  	tempNum.reverse();
  }
	else {
    tempNum.push(0);
  }

	for(let j = 0; j < 127; ++j) {
		floatPart *= 2;
		tempNum2.push(floatPart >= 1 ? 1 : 0);
		floatPart = floatPart >= 1 ? floatPart - Math.floor(floatPart) : floatPart;
	}
  return {
    characteristic: tempNum,
    mantissa: tempNum2,
    sign: negative ? 1 : 0
  };
}

function normalizeBinary(binaryParts) {
  let result = {
    characteristic: 1,
    mantissa: [],
    exponent: 0,
    sign: binaryParts.sign
  };
  if (binaryParts.characteristic.length > 1 || Math.abs(binaryParts.characteristic[0]) === 1) {
    result.exponent = binaryParts.characteristic.length - 1;
    result.mantissa = binaryParts.characteristic.slice(1).concat(binaryParts.mantissa).slice(0, 23);
  }
  else {
    for(let i = 0; i < binaryParts.mantissa.length; ++i) {
      --result.exponent;
      if (binaryParts.mantissa[i] === 1) {
        result.mantissa = binaryParts.mantissa.slice(i + 1, i + 24);
        break;
      }
    }
  }
  // pad
  if (result.mantissa.length < 23) {
    result.mantissa = result.mantissa.concat(new Array(23 - result.mantissa.length).fill(0));
  }
  return result;
}

function checkZero(number) {
  let zero = true;
  for(let i = 1; i < number.length; ++i) {
    if (number[i] === 1) {
      zero = false;
      break;
    }
  }
  return zero;
}

function binaryCharacteristicToDecimal(binary) {
  let base = 1;
  let decimal = 0;
  for (let i = binary.length - 1; i >= 0; --i) {
    decimal += binary[i] * base;
    base *= 2;
  }
  return decimal;
}

function binaryMantissaToDecimal(binary) {
  let base = 1.0;
  let decimal = 0;
  for (let i = 0; i < binary.length; ++i) {
    decimal += binary[i] * base;
    base /= 2;
  }
  return decimal;
}

function ieeeToDecimal(ieee) {
  let exponent = binaryCharacteristicToDecimal(ieee.slice(1, 9)) - 127;
  let mantissa = binaryMantissaToDecimal(ieee.slice(9));
  return (mantissa + (2 ** exponent)) * (ieee[0] === 0 ? 1 : -1);
}
