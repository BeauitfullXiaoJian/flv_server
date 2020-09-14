
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = low(new FileSync(__dirname + '/../public/db.json'));
db.defaults({ notes: [], api: [] }).write();

function saveNote(note) {
    return db.get('notes').push(note).write();
}

function getNotes(limit, offset) {
    const notes = db.get('notes');
    return {
        total: notes.size,
        rows: notes.slice(offset, offset + limit)
    };
}

function saveApi(apiName, data) {
    db.get('api').push({ apiName, data }).write();
}


function getApi(apiName) {
    const api = db.get('api');
    const result = api.toJSON().find(e => e.apiName === apiName);
    return result ? result.data : null;
}

module.exports = { getApi, saveApi };