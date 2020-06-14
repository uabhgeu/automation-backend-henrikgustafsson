import * as clientHelpers from '../helpers/clientHelpers'
import * as roomHelpers from '../helpers/roomHelpers'


describe('testing auth', function () {

    // First test case. Not using helpers
    it('test case 1, not using helpers', function () {
        cy.authenticateSession().then((response => {
            cy.request({
                method: "GET",
                url: 'http://localhost:3000/api/clients',
                headers: {
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },
            }).then((response => {
                cy.log(response.body[0].id)
                cy.log(response.body[0].created)
                cy.log(response.body[0].name)
                cy.log(response.body[0].email)
                cy.log(response.body[0].telephone)
                cy.logoutuser()
            }))
        }))
    })

    // Test case. Create a new client 
    it('Create a new client', function () {
        clientHelpers.createClient(cy),
            cy.logoutuser()
    })

    // Test case. List all clients
    it('Get clients', function () {
        clientHelpers.getClients(cy),
            cy.logoutuser()
    })

    // Test case. Create a client and delete it
    it('Create client and delete', function () {
        clientHelpers.createClientRequestAndDelete(cy),
            cy.logoutuser()
    })

    // Test case. List all rooms
    it('Get rooms', function () {
        roomHelpers.getRooms(cy),
            cy.logoutuser()
    })

    // Test case. Create a new room
    it('Create a new room', function () {
        roomHelpers.createRoom(cy),
            cy.logoutuser()
    })

    // Test case. Create a room and delete it.
    it('Delete last created room after get', function () {
        roomHelpers.createRoom(cy),
            roomHelpers.deleteLastCreatedRoomAfterGet(cy),
            cy.logoutuser()
    })
})