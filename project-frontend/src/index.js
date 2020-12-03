class Recipe {
    static all = [];
    constructor(id, name, ingredients, time, skill_level, course, ratings) {
      this.id = id;
      this.name = name;
      this.ingredients = ingredients;
      this.time = time;
      this.skill_level = skill_level;
      this.course = course;
      this.ratings = ratings;
      this.constructor.all.push(this)
    }

    static filterByCourse = (search) => 
        this.all.filter(recipe => {
            return recipe.course.includes(search)
            })
    
    static filterByCourseAndIngredients (course, ingredient) {
        let filteredRecipes = this.all.filter(recipe => {
            return recipe.course.toLowerCase().includes(course)
            })
        return filteredRecipes.filter(recipe => {
            return recipe.ingredients.toLowerCase().includes(ingredient)
        }) 
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
           new Recipe(recipe.id, recipe.name, recipe.ingredients, recipe.time, recipe.skill_level, recipe.course, recipe.ratings)
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
    if (ingredientsText.value == '' || ingredientsText.value == ' ') {
        alert("Please enter an ingredient");
    }
    else {
        const ingredients = ingredientsText.value.toLowerCase().replace(/[^A-Za-z0-9-' ]+/g, '');
        let filteredRecipes = Recipe.filterByCourseAndIngredients(courseList.value, ingredients)
       
        if (filteredRecipes.length == 0) {
            alert("No recipes were found with that ingredient");
        }
        else { 
        ingredientsButton.removeEventListener('click', findRecipesByIngredients)
        let question = document.getElementById('ingredients-question')
        question.className = "selected"
        }
        
}
}
// let input = document.createElement("input");
    //     input.type = "text"
    //     input.name = "course"
    // let btn = document.createElement("button");
    //     btn.id = 'course-button'
    //     btn.innerText = `Enter`
    //     btn.addEventListener('click', findRecipesByCourse)
    // question.appendChild(input)
    // question.appendChild(btn)