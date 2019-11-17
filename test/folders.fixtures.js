function makeFoldersArray() {
    return [
        {
            id: 1,
            title: 'Folder 1',
            date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            id: 2,
            title: 'Folder 2',
            date_created: '2019-01-22T16:28:32.615Z'
        },
    ];
}

function makeMaliciousFolder() {
    const maliciousFolder = {
        id: 911,
        title: 'Naughty naughty very naughty <script>alert("xss");</script>',
        date_created: new Date().toISOString()
    }
    const expectedFolder = {
        ...maliciousFolder,
        title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    }
    return {
        maliciousFolder,
        expectedFolder,
    }
}

module.exports = {
    makeFoldersArray,
    makeMaliciousFolder,
}