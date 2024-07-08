import numeral from 'numeral';
// Importing the numeral library for number formatting.

// ----------------------------------------------------------------------

export function fNumber(number) {
  // Function to format a number using the default numeral format.
  return numeral(number).format();
}

export function fCurrency(number) {
  // Function to format a number as a currency (₹) with two decimal places.
  const format = number ? numeral(number).format('₹0,0.00') : '';
  return result(format, '.00');
}

export function fPercent(number) {
  // Function to format a number as a percentage.
  // Converts the number to a percentage format with one decimal place.
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';
  return result(format, '.0');
}

export function fShortenNumber(number) {
  // Function to shorten a number using the 'a' notation (e.g., 1k, 1m).
  const format = number ? numeral(number).format('0.00a') : '';
  return result(format, '.00');
}

export function fShortenNumberIndian(number) {
  // Function to shorten a number using the Indian numbering system.
  // Checks if the input is a number.
  if (typeof number !== 'number') {
    return '₹0'; // Return '₹0' to maintain currency format if the input is not a number.
  }

  // Creates a formatter for the Indian numbering system.
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    notation: 'compact',
    compactDisplay: 'long',
  });

  // Formats the number using the formatter and returns the result.
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
// }

export function fData(number) {
  // Function to format a number as data size (e.g., 1.0 B).
  const format = number ? numeral(number).format('0.0 b') : '';
  return result(format, '.0');
}

function result(format, key = '.00') {
  // Function to remove unnecessary decimal places if the number is an integer.
  const isInteger = format.includes(key);
  return isInteger ? format.replace(key, '') : format;
}
