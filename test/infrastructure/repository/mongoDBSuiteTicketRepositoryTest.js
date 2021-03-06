'use strict';
var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');
var should = require('should');
var SuiteTicket = require('../../../lib/domain/suiteTicket');
var mongoDBSuiteTicketRepository = require('../../../lib/infrastructure/repository/mongoDBSuiteTicketRepository');

describe('suite ticket repository MongoDB use case test', function () {
    var Repository;
    before(function () {
        Repository = new mongoDBSuiteTicketRepository();
    });
    describe('#saveSuiteTicket(suiteTicket, cb)', function () {
        context('save a suite ticket', function () {
            it('should return true if save success', function (done) {
                var suiteTicket = new SuiteTicket({
                    suiteID: "suiteID",
                    ticket: "Ticket",
                    dateTime: new Date()
                });
                Repository.saveSuiteTicket(suiteTicket, function (err, isSuccess) {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getSuiteTicketBySuiteID(suiteID, cb)', function () {
        context('get a suite ticket for suite id', function () {
            it('should return null if no this suite ticket', function (done) {
                var suiteID = "noSuiteID";
                Repository.getSuiteTicketBySuiteID(suiteID, function (err, suiteTicket) {
                    _.isNull(suiteTicket).should.be.eql(true);
                    done();
                });
            });
            it('should return suite ticket', function (done) {
                var suiteID = "suiteID";
                Repository.getSuiteTicketBySuiteID(suiteID, function (err, suiteTicket) {
                    suiteTicket.suiteID.should.be.eql("suiteID");
                    suiteTicket.ticket.should.be.eql("Ticket");
                    done();
                });
            });
        });
    });
    after(function (done) {
        var MONGODB_SERVICE_HOST = process.env.MONGODB_SERVICE_HOST ? process.env.MONGODB_SERVICE_HOST : "127.0.0.1";
        var MONGODB_SERVICE_PORT = process.env.MONGODB_SERVICE_PORT ? process.env.MONGODB_SERVICE_PORT : "27017";
        MongoClient.connect(`mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/Wechat`, function (err, db) {
            if (err) {
                return;
            }
            db.collection('SuiteTicket').drop(function (err, response) {
                db.close();
                done();
            });
        });
    });
});