describe('Phonebook', function () {
  it('front page can be opened', function () {
    cy.visit('http://localhost:3000')
    cy.contains('Numbers')
    cy.contains('filter shown with')
  })
})
