const { PasswordService } = require("./Password.service.js");

const service = new PasswordService();
service.add("daniel", "word");
service.add("hello", "word");
service.add("world", "word");
// service.lock("daniel");
// service.unlock("daniel");
//service.del("daniel");

