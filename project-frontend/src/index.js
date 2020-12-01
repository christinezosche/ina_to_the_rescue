const RECIPES_URL = `http://localhost:3000/recipes`

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container')
    const newDiv = document.createElement('div')
    newDiv.className = 'card'
    let question = document.createElement('p')
    question.innerHTML = `What course are you making? `
    let input = document.createElement("input");
        input.type = "text"
        input.name = "course"
    let btn = document.createElement("button");
        btn.id = "course-button"
        btn.innerText = `Enter`
    question.appendChild(input)
    question.appendChild(btn)
    newDiv.appendChild(question)
    container.append(newDiv)


let courseButton = document.getElementById('course-button')
let courseText = document.querySelector('input[name="course"]')
courseButton.addEventListener('click', () => {
    
    fetch(RECIPES_URL)
    .then(function(response) {
        return response.json();
      })
      .then(function(array) {
        const search = courseText.value.toLowerCase()
        let searchResults = array.filter(recipe => {
            return recipe.course.toLowerCase().includes(search)
            })
        console.log(searchResults)
        for (const recipe of searchResults) {
            renderRecipeName(recipe)
          }
      })

})

})

function renderRecipeName(recipe) {
    let potentialResults = document.getElementById('results')
    let item = document.createElement('p')
    item.innerHTML = recipe.name
    potentialResults.appendChild(item)
}

// @mountains = Mountain.where('country LIKE ?', "%#{params[:country]}%")