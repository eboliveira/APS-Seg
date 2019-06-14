const { PasswordService } = require("./Password.service.js");

const service = new PasswordService();
service.add("hello", "word");
service.lock("daniel");
service.unlock("daniel");
//service.del("daniel");

