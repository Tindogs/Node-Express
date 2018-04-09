'use strict';
var earthRadius = 6371;

var getDistanceFromRads = function (rads) {
    return parseFloat(rads * earthRadius);
};

var getRadsFromDistance = function (distance) {
    return parseFloat(distance / earthRadius);
};
module.exports =  {
        getDistanceFromRads: getDistanceFromRads,
        getRadsFromDistance: getRadsFromDistance
    };
