const { PasswordService } = require("./Password.service.js");

const service = new PasswordService();
service.add("daniel", "word");
service.add("hello", "Patati");
service.add("world", "Patata");
service.add("peixo", "Thuthubarao");
// service.lock("daniel");
// service.unlock("daniel");
//service.del("daniel");

// $6$eqYkg42w$
const pass = "KZQ0fQnpTZWv8iDZJRIJsZwVFTTOiRbHIVCTSBTHsfehxG27WsZgx9GuXJ4FyNGNU8Aq1Xh0syy6LB5MDd.yT0"

console.log(pass.length)
console.log(pass)