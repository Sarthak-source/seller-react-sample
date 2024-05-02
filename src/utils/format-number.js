import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fNumber(number) {
  return numeral(number).format();
}

export function fCurrency(number) {
  const format = number ? numeral(number).format('₹0,0.00') : '';

  return result(format, '.00');
}

export function fPercent(number) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number) {
  const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}


export function fShortenNumberIndian(number) {

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    notation: 'compact',
    compactDisplay: 'long',
  })

  return formatter.format(number);
}


// export function fShortenNumberIndian(number) {
//   if (!number) return '';

//   // Define suffixes for Indian numbering system
//   const suffixes = ['', 'k', 'L', 'Cr', 'Ar', 'Ab'];

//   // Determine the appropriate suffix based on the number of digits

//   const formatedNumber=  Math.floor((String(number)));


//   const lengthOfNumber =  formatedNumber.toString().length;

//   console.log('lengthOfNumber',lengthOfNumber,formatedNumber);

//   switch (lengthOfNumber) {
//     case 4:
//       return `${formatedNumber.toString().substring(0,1)}.${formatedNumber.toString().substring(3,4)}${suffixes[1]}`;
//     case 5:
//       return `${formatedNumber.toString().substring(0,2)}.${formatedNumber.toString().substring(4,5)}${suffixes[1]}`;
//     case 6:
//       return `${formatedNumber.toString().substring(0,1)}.${formatedNumber.toString().substring(3,4)}${suffixes[2]}`;
//     case 7:
//       return `${formatedNumber.toString().substring(0,2)}.${formatedNumber.toString().substring(3,4)}${suffixes[2]}`;

//       case 8:
//         return `${formatedNumber.toString().substring(0,2)}.${formatedNumber.toString().substring(2,3)}${suffixes[3]}`;

//         case 9:
//           return `${formatedNumber.toString().substring(0,2)}.${formatedNumber.toString().substring(4,5)}${suffixes[3]}`;

//     default:
//       break;
//   }


//   // // Divide the number by the appropriate power of 100 to get the shortened number
//   // const shortenedNumber = Number(number) / (100 ** (suffixIndex * 2));

//   // // Format the shortened number with two decimal places and the appropriate suffix
//   // const formattedNumber = `${shortenedNumber.toFixed(2)}${suffixes[suffixIndex]}`;

//   // return formattedNumber;
// }


export function fData(number) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

function result(format, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}
