import * as clientHelpers from '../helpers/clientHelpers'
import * as roomHelpers from '../helpers/roomHelpers'


describe('testing auth', function(){

    it('test case 1', function(){
        cy.authenticateSession().then((response =>{
            cy.request({
                method: "GET",
                url: 'http://localhost:3000/api/clients',
                headers:{
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
            },
        }).then((response =>{
            cy.log(response.body[0].id)
            cy.log(response.body[0].created)
            cy.log(response.body[0].name)
            cy.log(response.body[0].email)
            cy.log(response.body[0].telephone)
            cy.logoutuser()
        }))
    }))
    })


    it('Create a new client', function(){
        clientHelpers.createClient(cy),
        cy.logoutuser()
    })

    it('Get clients', function(){
        clientHelpers.getClients(cy),
        cy.logoutuser()
    })

    it('Create client and delete', function(){
        clientHelpers.createClientRequestAndDelete(cy),
        cy.logoutuser()
    })

    it('Get rooms', function(){
        roomHelpers.getRooms(cy),
        cy.logoutuser()
    })

    it('Create a new room', function(){
        roomHelpers.createRoom(cy),
        cy.logoutuser()
    })

    it.only('Delete last created room after get', function(){
        roomHelpers.createRoom(cy),
        roomHelpers.deleteLastCreatedRoomAfterGet(cy),
        cy.logoutuser()
    })
})