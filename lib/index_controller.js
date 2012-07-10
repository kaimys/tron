var IndexController = function IndexController() { };

IndexController.index = function(request, response) {
    response.header("Content-Type", "application/json");
    response.send(JSON.stringify({message: "Hello World"}));
};

module.exports = IndexController;
