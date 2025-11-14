const bcrypt = require('bcryptjs');

const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);

console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nSQL to update admin:');
console.log(`UPDATE users SET password = '${hash}' WHERE email = 'admin@halalinthecity.com';`);
