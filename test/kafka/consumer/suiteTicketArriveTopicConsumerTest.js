'use strict';
var kafka = require('kafka-node');
var _ = require('underscore');
var should = require('should');
var muk = require('muk');
var bearcat = require('bearcat');

describe('suite ticket arrive topic consumer use case test', function () {
    var consumer;
    var producer;
    var producerClient;
    before(function (done) {
        var contextPath = require.resolve('../../../unittest_kafka_bcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            var ZOOKEEPER_SERVICE_HOST = process.env.ZOOKEEPER_SERVICE_HOST ? process.env.ZOOKEEPER_SERVICE_HOST : "127.0.0.1";
            var ZOOKEEPER_SERVICE_PORT = process.env.ZOOKEEPER_SERVICE_PORT ? process.env.ZOOKEEPER_SERVICE_PORT : "2181";
            var Producer = kafka.Producer;
            producerClient = new kafka.Client(`${ZOOKEEPER_SERVICE_HOST}:${ZOOKEEPER_SERVICE_PORT}`);
            producer = new Producer(producerClient);
            producer.on('ready', function () {
                producer.createTopics(['suite-ticket-arrive'], true, (err, data)=> {
                    producerClient.refreshMetadata(['suite-ticket-arrive'], ()=> {
                        done();
                    });
                });
            });
            producer.on('error', (err)=> {
                done(err);
            });
            consumer = bearcat.getBean('suiteTicketArriveTopicConsumer');
        });
    });
    describe('#startConsume(callback)', function () {
        context('start consume suite-ticket-arrive topic', function () {
            it('should call suiteAccessTokenService.updateSuiteTicket methods when consumer this topic', function (done) {
                var mockSuiteAccessTokenService = {};
                mockSuiteAccessTokenService.updateSuiteTicket = ()=> {
                    done();
                };
                muk(consumer, "__SuiteAccessTokenService__", mockSuiteAccessTokenService);
                consumer.startConsume();
                var suiteTicketData = {
                    suiteID: "suiteID",
                    ticket: "ticket",
                    dateTime: new Date()
                };
                producer.send([{
                    topic: "suite-ticket-arrive",
                    messages: [JSON.stringify(suiteTicketData)]
                }], ()=> {
                });
            });
        });
    });
    after(function (done) {
        consumer.stopConsume();
        producer.close();
        producerClient.close(()=> {
            done();
        });
    });
})
;