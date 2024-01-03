// const crypto = require('crypto');

// // Generate a random 32-byte key for AES-256
// const secretKey = crypto.randomBytes(32);

// // Initialization Vector (IV)
// const iv = crypto.randomBytes(16);

// // Function to encrypt a message
// const encrypt = (message, secretKey, iv) => {
//   const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
//   let encrypted = cipher.update(message, 'utf-8', 'hex');
//   encrypted += cipher.final('hex');
//   return {
//     iv: iv.toString('hex'),
//     encrypted: encrypted,
//   };
// };

// // Function to decrypt a message
// const decrypt = (encryptedData, secretKey) => {
//   const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, Buffer.from(encryptedData.iv, 'hex'));
//   let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf-8');
//   decrypted += decipher.final('utf-8');
//   return decrypted;
// };

// // Example usage
// const originalMessage = 'Hello, this is a secret message!';

// // Encrypt the message
// const encryptedData = encrypt(originalMessage, secretKey, iv);
// console.log('Encrypted:', encryptedData);

// // Decrypt the message
// const decryptedMessage = decrypt(encryptedData, secretKey);
// console.log('Decrypted:', decryptedMessage);


const amount = 400;
let cp = 0.7816;

const buy = [];
const sell = [];

const maxOrder = 6;
const eachQty = 75;
const firstOrder = cp;
const bp = 0.75;
const sp = 0.75;
const fso = firstOrder + ((firstOrder * sp) / 100);
sell.push(fso.toFixed(4));
buy.push(firstOrder);
for(let i =1;i<maxOrder;i++){
    const bOrder = buy[i-1] - ((buy[i-1] * bp) /100);
    const sOrder = bOrder + (bOrder*sp/100);
    buy.push(bOrder.toFixed(4));
    sell.push(sOrder.toFixed(4));
}
console.log(buy);
console.log(sell);

const profit = ((cp*eachQty) * sp )/ 100;
console.log(profit);