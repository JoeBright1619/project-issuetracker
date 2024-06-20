const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    this.timeout(5000);
    const project = 'testproject';
    let issueId;

    suite('POST request to /api/issues/{project}', () => {
        test('Create an issue with every field:', (done) => {
            chai.request(server)
                .post(`/api/issues/${project}`)
                .send({
                    issue_title: 'Test Issue Title',
                    issue_text: 'Test Issue Text',
                    created_by: 'Test User',
                    assigned_to: 'Test Assignee',
                    status_text: 'In Progress'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, '_id');
                    issueId = res.body._id;
                    assert.equal(res.body.issue_title, 'Test Issue Title');
                    assert.equal(res.body.issue_text, 'Test Issue Text');
                    assert.equal(res.body.created_by, 'Test User');
                    assert.equal(res.body.assigned_to, 'Test Assignee');
                    assert.equal(res.body.status_text, 'In Progress');
                    done();
                });
        });

        test('Create an issue with only required fields:', (done) => {
            chai.request(server)
                .post(`/api/issues/${project}`)
                .send({
                    issue_title: 'Test Issue Title',
                    issue_text: 'Test Issue Text',
                    created_by: 'Test User'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, '_id');
                    assert.equal(res.body.issue_title, 'Test Issue Title');
                    assert.equal(res.body.issue_text, 'Test Issue Text');
                    assert.equal(res.body.created_by, 'Test User');
                    assert.equal(res.body.assigned_to, '');
                    assert.equal(res.body.status_text, '');
                    done();
                });
        });

        test('Create an issue with missing required fields:', (done) => {
            chai.request(server)
                .post(`/api/issues/${project}`)
                .send({
                    issue_title: '',
                    issue_text: '',
                    created_by: ''
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'required field(s) missing');
                    done();
                });
        });
    });

    suite('GET request to /api/issues/{project}', () => {
        test('View issues on a project:', (done) => {
            chai.request(server)
                .get(`/api/issues/${project}`)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    done();
                });
        });

        test('View issues on a project with one filter:', (done) => {
            chai.request(server)
                .get(`/api/issues/${project}`)
                .query({ issue_title: "Test Issue Title" })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    done();
                });
        });

        test('View issues on a project with multiple filters:', (done) => {
            chai.request(server)
                .get(`/api/issues/${project}`)
                .query({ issue_title: "Test Issue Title", open: true })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    done();
                });
        });
    });

    suite('PUT request to /api/issues/{project}', () => {
        test('Update one field on an issue', (done) => {
            chai.request(server)
                .put(`/api/issues/${project}`)
                .send({
                    _id: issueId,
                    issue_text: 'Updated Issue Text'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'result');
                    assert.equal(res.body.result, 'successfully updated');
                    done();
                });
        });

        test('Update multiple fields on an issue', (done) => {
            chai.request(server)
                .put(`/api/issues/${project}`)
                .send({
                    _id: issueId,
                    issue_title: 'Updated Issue Title',
                    status_text: 'Resolved'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'result');
                    assert.equal(res.body.result, 'successfully updated');
                    done();
                });
        });

        test('Update an issue with missing _id', (done) => {
            chai.request(server)
                .put(`/api/issues/${project}`)
                .send({
                    issue_text: 'Updated Issue Text'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'missing _id');
                    done();
                });
        });

        test('Update an issue with no fields to update', (done) => {
            chai.request(server)
                .put(`/api/issues/${project}`)
                .send({
                    _id: issueId
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'no update field(s) sent');
                    done();
                });
        });

        test('Update an issue with an invalid _id', (done) => {
            chai.request(server)
                .put(`/api/issues/${project}`)
                .send({
                    _id: 'invalidid',
                    issue_text: 'Updated Issue Text'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'could not update');
                    assert.property(res.body, '_id');
                    assert.equal(res.body._id, 'invalidid');
                    done();
                });
        });
    });

    suite('DELETE request to /api/issues/{project}', () => {
        test('Delete an issue', (done) => {
            chai.request(server)
                .delete(`/api/issues/${project}`)
                .send({ _id: issueId })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'result');
                    assert.equal(res.body.result, 'successfully deleted');
                    assert.property(res.body, '_id');
                    assert.equal(res.body._id, issueId);
                    done();
                });
        });

        test('Delete an issue with an invalid _id', (done) => {
            chai.request(server)
                .delete(`/api/issues/${project}`)
                .send({ _id: 'invalidid' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'could not delete');
                    done();
                });
        });

        test('Delete an issue with missing _id', (done) => {
            chai.request(server)
                .delete(`/api/issues/${project}`)
                .send({})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'missing _id');
                    done();
                });
        });
    });
});
