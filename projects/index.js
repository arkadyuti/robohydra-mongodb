/**
 * Created by amuru1 on 12/10/2016.
 */
var RoboHydraHeadStatic = require("robohydra").heads.RoboHydraHeadStatic;
var RoboHydraHead       = require("robohydra").heads.RoboHydraHead;

var _ = require("lodash");

var fs = require('fs');

exports.getBodyParts = function(conf) {
    return {
        heads: [
           
            new RoboHydraHead({
                path: '/projects',
                handler : function(req,res) {
                    var currentPage,
                        perPage,
                        sortBy,
                        sortOrder;

                    if(req.queryParams.sortBy) {
                        sortBy = req.queryParams.sortBy;
                        sortOrder = req.queryParams.sortOrder.toLowerCase() || "asc";
                    }
                    else if(req.queryParams.page) {
                        currentPage = parseInt(req.queryParams.page);                        
                    }
                    else if(req.queryParams.perPage) {
                        perPage = parseInt(req.queryParams.perPage);
                    }

                    var projects = getProjectJSON(currentPage,perPage,sortBy,sortOrder);
                    res.send(JSON.stringify(projects))
                }
            })
        ]
    };
};
var projects;
fs.readFile('/one.json', 'utf8', function(err, contents) {
    projects = contents;
});

function getProjectJSON(currentPage,perPage,sortBy,sortOrder) {
    
    currentPage = currentPage || projects.currentpage;
    perPage = perPage || projects.perpage;
    sortBy = sortBy || projects.sortby || "pid";
    sortOrder = sortOrder || projects.sortorder || "asc";

    var filteredProject = Object.assign({},projects), filteredData = [];

    var data = filteredProject.data;
    data = _.orderBy(data, function(item) {
        return item[sortBy].toLowerCase();
    }, sortOrder);//orderBy
    for(var i = (currentPage - 1)*perPage; i < currentPage * perPage && i < filteredProject.count ;i++) {
        filteredData.push(data[i]);
    }
    filteredProject.data = filteredData;
    filteredProject.currentpage = currentPage;
    filteredProject.perpage = perPage;
    filteredProject.sortby = sortBy;
    filteredProject.sortorder = sortOrder;

    // here i am explicitly mutating the projects JSON itself.
    projects.perpage = perPage;
    projects.currentpage = currentPage;
    projects.sortby = sortBy;
    projects.sortorder = sortOrder;

    return filteredProject;
}

