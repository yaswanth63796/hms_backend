import bcrypt from 'bcrypt';

const hashed = await bcrypt.hash("pass123", 10);
console.log(hashed);
