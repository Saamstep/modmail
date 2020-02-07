const os = require("os");

const outputString = `
Free mem: ${os.freemem()} bytes
OS TYPE: ${os.type()}
OS: ${os.release()}
CPU: ${os.cpus()[0].model} 
`;

console.log(outputString);
