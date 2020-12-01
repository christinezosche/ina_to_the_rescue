class Recipe {
    constructor(name, ingredients, time, steps, skill_level, course) {
      this.name = name;
      this.ingredients = ingredients;
      this.time = time;
      this.steps = steps;
      this.skill_level = skill_level;
      this.course = course;
    }
  }

const searchResults = []
const RECIPES_URL = `http://localhost:3000/recipes`

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container')
    const newDiv = document.createElement('div')
    newDiv.className = 'card'
    let question = document.createElement('p')
    question.id = "course-question"
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
    container.appendChild(newDiv)


let courseButton = document.getElementById('course-button')
let courseText = document.querySelector('input[name="course"]')
courseButton.addEventListener('click', findRecipes)

function findRecipes () {
    if (courseText.value == '') {
        alert("Please enter a course");
    }
    else {
    fetch(RECIPES_URL)
    .then(function(response) {
        return response.json();
      })
      .then(function(array) {
        const search = courseText.value.toLowerCase()
        let filteredRecipes = array.filter(recipe => {
                 return recipe.course.toLowerCase().includes(search)
                 })
        for (const recipe of filteredRecipes) {
            searchResults.push(new Recipe(recipe.name, recipe.ingredients, recipe.time, recipe.steps, recipe.skill_level, recipe.course))
          }
        courseButton.removeEventListener('click', findRecipes)
        let question = document.getElementById('course-question')
        question.className = "selected"
        // let searchResults = array.filter(recipe => {
        //     return recipe.course.toLowerCase().includes(search)
        //     })
        // console.log(searchResults)
        for (const recipe of searchResults) {
            renderRecipeName(recipe)
          }
      })
    }
}

let testButton = document.createElement("button");
testButton.innerHTML = `Test`
container.appendChild(testButton)
testButton.addEventListener('click', () => {
    for (const recipe of searchResults) {
        console.log(recipe)
      }
})


})

function renderRecipeName(recipe) {
    let potentialResults = document.getElementById('results')
    let item = document.createElement('p')
    item.innerHTML = recipe.name
    potentialResults.appendChild(item)
}

