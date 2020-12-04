class Recipe {
    static all = [];
    constructor(id, name, ingredients, time, course, ratings) {
      this.id = id;
      this.name = name;
      this.ingredients = ingredients;
      this.time = time;
      this.course = course;
      this.ratings = ratings;
      this.constructor.all.push(this)
    }
    

    static filterByCourse = (search) => 
        this.all.filter(recipe => {
            return recipe.course.includes(search)
            })
    
    static filterByCourseAndIngredients (course, ingredients) {
        let filteredByCourse = Recipe.filterByCourse(course)
        let filteredByCourseAndIngredients = filteredByCourse.filter(recipe => {
            return ingredients.some(i => recipe.ingredients.toLowerCase().includes(i))
        }) 
        for (const recipe of filteredByCourseAndIngredients) {
            recipe.ingredientsCount = 0
           for (const i of ingredients) {
               if (recipe.ingredients.includes(i)){ 
                    recipe.ingredientsCount++
                }           
            }
        }
        filteredByCourseAndIngredients.sort((a, b) => b.ingredientsCount - a.ingredientsCount);
        return filteredByCourseAndIngredients

    }

    static filterByCourseIngredientsAndTime (course, ingredients, time) {
        let filteredByCourseAndIngredients = Recipe.filterByCourseAndIngredients (course, ingredients)
        if (time === 0) {
            return filteredByCourseAndIngredients
        }
        else {
        return filteredByCourseAndIngredients.filter(recipe => {
            return recipe.time <= time
        })
        }
    }
    


  }

const RECIPES_URL = `http://localhost:3000/recipes`

document.addEventListener('DOMContentLoaded', () => {
    fetch(RECIPES_URL)
    .then(function(response) {
        return response.json();
      })
    .then(function(array) {
        for (const recipe of array) {
           new Recipe(recipe.id, recipe.name, recipe.ingredients, recipe.time, recipe.course, recipe.ratings)
          }
        })

    renderPrompt()
})

function renderPrompt () {
    const container = document.getElementById('container')
    const newDiv = document.createElement('div')
    newDiv.className = 'card'
    newDiv.id = 'question-list'
    let question = document.createElement('p')
    question.id = "course-question"
    question.innerHTML = `What course are you making? `
    select = document.createElement("select");
    select.id = 'course-list'
    select.options.add( new Option(" ","", true, true) );
    select.options.add( new Option("Starter","starter") );
    select.options.add( new Option("Main","main") );
    select.options.add( new Option("Side","side") );
    select.options.add( new Option("Dessert","dessert") );
    select.addEventListener("change", findRecipesByCourse)
    question.appendChild(select)
    newDiv.appendChild(question)
    container.appendChild(newDiv)
}



function findRecipesByCourse () {
    let courseList = document.getElementById('course-list')
    let filteredRecipes = Recipe.filterByCourse(courseList.value)
    courseList.removeEventListener("change", findRecipesByCourse)
    courseList.disabled = true;

    let question = document.getElementById('course-question')
    question.className = "selected"
    
        appendIngredientsQuestion()
    
        for (const recipe of filteredRecipes) {
            renderRecipeName(recipe)
          }
        }
      



function renderRecipeName(recipe) {
    let potentialResults = document.getElementById('results')
    let item = document.createElement('p')
    item.innerHTML = recipe.name
    potentialResults.appendChild(item)
}

function appendIngredientsQuestion() {
    let div = document.getElementById('question-list')
        let question = document.createElement('p')
        question.id = "ingredients-question"
        question.innerHTML = `What ingredients do you have? `
        let input = document.createElement("input");
            input.type = "text"
            input.name = "ingredients"
        let btn = document.createElement("button");
            btn.id = "ingredients-button"
            btn.innerText = `Enter`
        question.appendChild(input)
        question.appendChild(btn)
        div.appendChild(question)
        btn.addEventListener('click', findRecipesByIngredients)
       
}

function findRecipesByIngredients() {
    let courseList = document.getElementById('course-list')
    let ingredientsButton = document.getElementById('ingredients-button')
    let ingredientsText = document.querySelector('input[name="ingredients"]')
    let question = document.getElementById('ingredients-question')
    if (ingredientsText.value === '' || ingredientsText.value === ' ') {
        if (question.childNodes[3]) {
            removeAlert(question, 3); }
        let alert = document.createElement("p")
            alert.innerText = `Please enter an ingredient.`
            alert.className = "alert"
            renderAlertButtons(alert)
            question.appendChild(alert)
    }
    else {
        if (question.childNodes[3]) {
            removeAlert(question, 3); }
       
            const ingredients = sanitizeAndSplit(ingredientsText.value)
            let filteredRecipes = Recipe.filterByCourseAndIngredients(courseList.value, ingredients)
       
            if (filteredRecipes.length === 0) {
                let alert = document.createElement("p")
                alert.className = "alert"
                alert.innerText = `No recipes found.`
                renderAlertButtons(alert)
                question.appendChild(alert)
            }
            else { 
                if (question.childNodes[3]) {
                    removeAlert(question, 3); }
                else {
                ingredientsButton.removeEventListener('click', findRecipesByIngredients)
                question.className = "selected"
                appendTimeQuestion()
                let potentialResults = document.getElementById('results')
                potentialResults.innerHTML = ''
                for (const recipe of filteredRecipes) {
                    renderRecipeName(recipe)
                  }
                }
            }
    
}
}

function renderAlertButtons (node) {
    let ingredientsButton = document.getElementById('ingredients-button')
    let ingredientsText = document.querySelector('input[name="ingredients"]')
    let question = document.getElementById('ingredients-question')

    let btn1 = document.createElement("button")
    btn1.id = "try-again-button"
    btn1.innerText = "Try again"
    let btn2 = document.createElement("button")
    btn2.innerText = "Skip this step, I'll shop"
    btn2.id = "shop-button"
    btn1.addEventListener("click", function (){
        ingredientsText.value = ''
        removeAlert(question, 3);;
    })

    btn2.addEventListener("click", function (){
        removeAlert(question, 3);
        ingredientsText.value = ''
        question.className = "selected"
        ingredientsButton.removeEventListener('click', findRecipesByIngredients)
        appendTimeQuestion()
    })
    node.appendChild(btn1)
    node.appendChild(btn2)
}

function removeAlert (element, index) {
    element.removeChild(element.childNodes[index]);
}

function appendTimeQuestion () {
    let div = document.getElementById('question-list')
    let question = document.createElement('p')
    question.id = "time-question"
    question.innerHTML = `How much time do you have? `
    select = document.createElement("select");
    select.id = 'time-list'
    select.options.add( new Option(" ","", true, true) );
    select.options.add( new Option("15 minutes",15) );
    select.options.add( new Option("30 minutes",30) );
    select.options.add( new Option("45 minutes",45) );
    select.options.add( new Option("One hour",60) );
    select.options.add( new Option("90 minutes",90) );
    select.options.add( new Option("2 hours",120) );
    select.options.add( new Option("More than two hours",0) );
    select.addEventListener("change", findRecipesByTime)
    question.appendChild(select)
    div.appendChild(question)
    container.appendChild(div)
}

function findRecipesByTime () {
let timeList = document.getElementById('time-list')
let courseList = document.getElementById('course-list')
let ingredientsText = document.querySelector('input[name="ingredients"]')
const ingredients = sanitizeAndSplit(ingredientsText.value)
let filteredRecipes = Recipe.filterByCourseIngredientsAndTime(courseList.value, ingredients, parseInt(timeList.value))
timeList.removeEventListener("change", findRecipesByTime)
timeList.disabled = true;

let question = document.getElementById('time-question')
question.className = "selected"

let potentialResults = document.getElementById('results')
potentialResults.innerHTML = ''

for (const recipe of filteredRecipes) {
        renderRecipeName(recipe)
      }
}


function sanitizeAndSplit (string) {
    let n = string.toLowerCase().replace(/[^A-Za-z0-9-' ]+/g, ' ')
    let newString = n.replace(/[  ]+/g, ' ')
    return newString.split(" ")
}