const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = low(new FileSync(__dirname + '/assets/db.json'));
db.defaults({ notes: [] }).write();

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