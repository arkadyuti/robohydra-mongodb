var heads               = require("robohydra").heads,
    RoboHydraHead       = heads.RoboHydraHead,
    RoboHydraHeadStatic = heads.RoboHydraHeadStatic;
var fs = require('fs');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/local");

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


var Schema = mongoose.Schema({
    "count": { type : Number, default: 30},
    "currentpage": { type : Number, default: 1},
    "perpage": { type : Number, default: 10},
    "filterby": { type : String, default: null},
    "filterval": { type : String, default: null},
    "sortby": { type : String, default: null},
    "sortorder": { type : String, default: null},
    "data": [{
        "pid": Number,
        "p_name": String,
        "scg": String,
        "location": String,
        "fe_lead_name": String,
        "p_status": String,
        "p_status_color_code": String,
        "p_techstack": String,
        "start_date": Date,
        "end_date": Date
    }]

});

var Project = mongoose.model('Project', Schema);
// var personOne = new MyModel({name : "arka"});
exports.getBodyParts = function() {
    return {
        heads: [
           

            new RoboHydraHead({
                path: "/pro",
                handler: function(req, res) {
                    res.headers["content-type"] = "text/plain";
                    res.headers["Access-Control-Allow-Origin"] = "*";
                    res.headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept";
                    // var test = JSON.parse(req.body);

                    // var test = JSON.parse( JSON.stringify(req.body) );
                    var dataBody = JSON.parse(req.body);
                    // console.log(test.pid);
                    // console.log(dataBody);
                    var dataToInsert = new Project ({
                        "data": [{
                        "pid": dataBody.pid,
                        "p_name": dataBody.p_name,
                        "scg": dataBody.scg,
                        "location": dataBody.location,
                        "fe_lead_name": dataBody.fe_lead_name,
                        "p_status": dataBody.p_status,
                        "p_status_color_code": dataBody.p_status_color_code,
                        "p_techstack": dataBody.p_techstack,
                        "start_date": dataBody.start_date,
                        "end_date": dataBody.end_date
                        }]
                    });
                    var test = {
                        "pid": dataBody.pid,
                        "p_name": dataBody.p_name,
                        "scg": dataBody.scg,
                        "location": dataBody.location,
                        "fe_lead_name": dataBody.fe_lead_name,
                        "p_status": dataBody.p_status,
                        "p_status_color_code": dataBody.p_status_color_code,
                        "p_techstack": dataBody.p_techstack,
                        "start_date": dataBody.start_date,
                        "end_date": dataBody.end_date
                        }
                    console.log(dataToInsert);
                    dataToInsert.findByIdAndUpdate(
                     
                        {$push: {"data": test}},
                        {safe: true, upsert: true},
                        function(err, model) {
                            console.log(err);
                        }
                    );
                    // dataToInsert.save(function (err, dataToInsert) {
                    // dataToInsert.update({$pushAll: {data:test}},{upsert:true},function(err){
                    //     if (err)
                    //     {
                    //         res.send(err);
                    //     }else {
                    //         res.send( JSON.stringify(dataToInsert));
                    //     }
                    // });
                    // MyModel.find(function (err, p) {
                    //         res.send(JSON.stringify(p));
                    //     }
                    // );
                   
                }
            })
        ]
    };
};