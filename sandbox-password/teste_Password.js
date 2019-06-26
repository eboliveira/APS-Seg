const { PasswordService } = require("./Password.service.js");

const service = new PasswordService();
console.log(service.add("daniel", "word"));
console.log(service.add("hello", "Patati"));
console.log(service.add("world", "Patata"));
console.log(service.add("peixo", "Thuthubarao"));
console.log(service.lock("daniel"));
console.log(service.lock("hello"));
// service.lock("daniel");
// service.unlock("daniel");
//service.del("daniel");

// $6$eqYkg42w$
const pass = "KZQ0fQnpTZWv8iDZJRIJsZwVFTTOiRbHIVCTSBTHsfehxG27WsZgx9GuXJ4FyNGNU8Aq1Xh0syy6LB5MDd.yT0"

console.log(pass.length);
console.log(pass);