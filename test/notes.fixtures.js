function makeNotesArray() {
    return [
        {
            id: 1,
            title: 'First note!',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            folder: 1,
            date_modified: '2029-01-22T16:28:32.615Z'
        },
        {
            id: 2,
            title: 'Second note!',
            content: 'Lorry ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            folder: 2,
            date_modified: '2019-01-22T16:28:32.615Z'
        },
        {
            id: 3,
            title: 'Third note!',
            content: 'Laura ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            folder: 1,
            date_modified: '2009-01-22T16:28:32.615Z'
        },
        {
            id: 4,
            title: 'Fourth note!',
            content: 'LorTab ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            folder: 2,
            date_modified: '2014-01-22T16:28:32.615Z'
        },
    ];
}

function makeMaliciousNote() {
    const maliciousNote = {
        id: 911,
        title: 'Naughty naughty very naughty <script>alert("xss");</script>',
        content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        date_modified: new Date().toISOString()
    }
    const expectedNote = { 
        ...maliciousNote,
        title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }
    return {
        maliciousNote,
        expectedNote,
    }
}

module.exports = {
    makeNotesArray,
    makeMaliciousNote,
}