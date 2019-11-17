const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeFoldersArray, makeMaliciousFolder } = require('./folders.fixtures')

describe(`Folders Endpoints`, function() {
    let db

    before(`make knex instance`, () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after(`disconnect from db`, () => db.destroy())

    before(`clean the table`, () => db.raw(`TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE`))

    afterEach(`cleanup`, () => db.raw(`TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE`))

    describe(`GET /api/folders`, () => {
        context(`Given no folders`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get(`/api/folders`)
                    .expect(200, [])
            })
        })

        context(`Given there are folders in the database`, () => {
            const testFolders = makeFoldersArray();

            beforeEach(`insert folders`, () => {
                return db
                    .into('noteful_folders')
                    .insert(testFolders)
            })

            it(`responds with 200 and all of the folders`, () => {
                return supertest(app)
                    .get(`/api/folders`)
                    .expect(200, testFolders)
            })
        })

        context(`Given an XSS attack folder`, () => {
            const { maliciousFolder, expectedFolder } = makeMaliciousFolder()

            beforeEach(`insert malicious folder`, () => {
                return db
                    .into('noteful_folders')
                    .insert([ maliciousFolder ])
            })

            it(`removes XSS attack content`, () => {
                return supertest(app)
                    .get(`/api/folders`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].title).to.eql(expectedFolder.title)
                    })
            })
        })
    })

    describe(`GET /api/folders/:folder_id`, () => {
        context(`Given no folders`, () => {
            it(`responds with 404`, () => {
                const folderId = 123456
                return supertest(app)
                    .get(`/api/folders/${folderId}`)
                    .expect(404, { error: { message: `Folder doesn't exist` } }) 
        
            })
        })

        context(`Given there are folders in the database`, () => {
            const testFolders = makeFoldersArray();

            beforeEach(`insert folders`, () => {
                return db
                    .into('noteful_folders')
                    .insert(testFolders)
            })

            it(`responds with 200 and the specified folder`, () => {
                const folderId = 2
                const expectedFolder = testFolders[folderId - 1]

                return supertest(app)
                    .get(`/api/folders/${folderId}`)
                    .expect(200, expectedFolder)
            })
        })

        context(`Given an XSS attack folder`, () => {
            const { maliciousFolder, expectedFolder } = makeMaliciousFolder()

            beforeEach(`insert malicious folder`, () => {
                return db
                    .into('noteful_folders')
                    .insert([ maliciousFolder ])
            })

            it(`removes XSS attack content`, () => {
                return supertest(app)
                    .get(`/api/folders/${maliciousFolder.id}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.title).to.eql(expectedFolder.title)
                    })
            })
        })
    })

    describe.only(`POST /api/folders`, () => {
        it(`creates a folder, responding with 201 and the new folder`, function() {
            this.retries(3)
            const newFolder = {
                title: 'New test folder'
            }
            return supertest(app)
                .post(`/api/folders`)
                .send(newFolder)
                .expect(201)
                .expect(res => {
                    expect(res.body.title).to.eql(newFolder.title)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/folders/${res.body.id}`)
                    const expected = new Date().toLocaleString('en', { timeZone: 'UTC' })
                    const actual = new Date(res.body.date_created).toLocaleString()
                    expect(actual).to.eql(expected)
                })
                .then(postRes =>
                     supertest(app)
                        .get(`/api/folders/${postRes.body.id}`)
                        .expect(postRes.body)
                )
        })

        
    })
})