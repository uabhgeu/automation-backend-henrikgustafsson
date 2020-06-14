const faker = require('faker')

const ENDPOINT_CREATE_CLIENT = 'http://localhost:3000/api/client/new'
const ENDPOINT_GET_CLIENTS = 'http://localhost:3000/api/clients'
const ENDPOINT_GET_CLIENT = 'http://localhost:3000/api/client/'

// Create random payload
function createRandomClientPayload() {
    const fakeName = faker.name.firstName()
    const fakeEmail = faker.internet.email()
    const fakePhone = faker.phone.phoneNumber()
    const payload = {
        "name": fakeName,
        "email": fakeEmail,
        "telephone": fakePhone
    }

    return payload
}

// Function to list all clients
function getClients(cy) {
    cy.authenticateSession().then((response => {
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_CLIENTS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            const responseAsString = JSON.stringify(response)
            cy.log(responseAsString)
        }))
    }))
}

// Function to list all clients, with assertions
function getClientsWithAssertion(cy, name, email, telephone) {
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_CLIENTS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        const responseAsString = JSON.stringify(response)
        expect(responseAsString).to.have.string(name)
        expect(responseAsString).to.have.string(email)
        expect(responseAsString).to.have.string(telephone)
    }))
}

// Function to create a new client using randomly generated data
function createClient() {
    cy.authenticateSession().then((response => {
        let fakeClientPayload = createRandomClientPayload()

        // Post request to create a client
        cy.request({
            method: "POST",
            url: ENDPOINT_CREATE_CLIENT,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: fakeClientPayload
        }).then((response => {
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeClientPayload.name)
        }))

        getClientsWithAssertion(cy, fakeClientPayload.name, fakeClientPayload.email, fakeClientPayload.telephone)

    }))
}


// Function to create a client and delete it
function createClientRequestAndDelete(cy) {
    cy.authenticateSession().then((response => {
        let fakeClientPayload = createRandomClientPayload()

        // Post request to create a client
        cy.request({
            method: "POST",
            url: ENDPOINT_CREATE_CLIENT,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: fakeClientPayload
        }).then((response => {
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeClientPayload.name)
        }))
        deleteRequestAfterGet(cy)
    }))
}


// Function to delete a client after GET
function deleteRequestAfterGet(cy) {
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_CLIENTS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        let lastId = response.body[response.body.length - 1].id
        cy.request({
            method: "DELETE",
            url: ENDPOINT_GET_CLIENT + lastId,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        })
    }))

}


module.exports = {
    createRandomClientPayload,
    createClient,
    getClients,
    getClientsWithAssertion,
    createClientRequestAndDelete
}