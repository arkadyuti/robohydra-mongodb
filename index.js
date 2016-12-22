var heads               = require("robohydra").heads,
    RoboHydraHead       = heads.RoboHydraHead,
    RoboHydraHeadStatic = heads.RoboHydraHeadStatic;
var fs = require('fs');
 
exports.getBodyParts = function() {
    return {
        heads: [
            new RoboHydraHeadStatic({
                path: "/get",
                contentType: "text/plain",
                content: "If you're reading this, it seems GET requests work!"
            }),

            new RoboHydraHead({
                path: "/post",
                handler: function(req, res) {
                    res.headers["content-type"] = "text/plain";
                    res.headers["Access-Control-Allow-Origin"] = "*";
                    res.headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept";
                    
                    var postData = req.body;
                    var projects;
                    // var postDataPID = JSON.parse(postData);
                    console.log(postData['pid']);
                    fs.readFile('/one.json', 'utf8', function(err, contents) {

                        
                        projects = JSON.parse(contents);
                        
                        projects.data.push(postData);
                        
                       fs.writeFile("/one.json", JSON.stringify(projects) , function(err) {
                            if(err) {
                                return console.log(err);
                            }
                            console.log("The file was saved!");
                        });
                    });

                    res.send(JSON.stringify(postData));

                    
                }
            })
        ]
    };
};