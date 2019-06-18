const { PasswordService } = require("./Password.service.js");

const service = new PasswordService();
// console.log(service.add("daniel", "word"));
// console.log(service.add("hello", "Patati"));
// console.log(service.add("world", "Patata"));
console.log(service.add("peixo", "Thuthubarao"));
service.managerPasswd.update();
service.managerShadow.update();
// console.log(service.lock("daniel"));
// console.log(service.lock("hello"));
// service.lock("daniel");
// service.unlock("daniel");
//service.del("daniel");
