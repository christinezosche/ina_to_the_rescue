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
const RATINGS_URL = `http://localhost:3000/ratings`

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
                if (ingredients.length > 1) {
                alert.innerText = `No recipes found with those ingredients.` 
                }
                else {
                    alert.innerText = `No recipes found with that ingredient.` 
                }
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
        removeAlert(question, 3);
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
let question = document.getElementById('time-question')
let potentialResults = document.getElementById('results')
if (question.childNodes[2]) {
    removeAlert(question, 2); }

if (filteredRecipes.length === 0) {
    let alert = document.createElement("p")
    alert.className = "alert"
    alert.innerText = `No recipes found. Choose another time. `
    let btn = document.createElement("button")
    btn.innerText = "Skip this step"
    btn.addEventListener("click", function (){
        removeAlert(question, 2);
        potentialResults.innerHTML = ''
        fetchMatchingRecipe(Recipe.filterByCourseAndIngredients(courseList.value, ingredients))
    })
    alert.appendChild(btn)
    question.appendChild(alert)
    }

else {
    potentialResults.innerHTML = ''
    fetchMatchingRecipe(filteredRecipes)
}

}


function sanitizeAndSplit (string) {
    let n = string.toLowerCase().replace(/[^A-Za-z0-9-' ]+/g, ' ')
    let newString = n.replace(/[  ]+/g, ' ')
    return newString.split(" ")
}

function fetchMatchingRecipe(recipeArray) {
    
    let timeList = document.getElementById('time-list')
    timeList.removeEventListener("change", findRecipesByTime)
    timeList.disabled = true;
    let question = document.getElementById('time-question')
    question.className = "selected"

    let selectedRecipe = recipeArray[0]

    fetch(`${RECIPES_URL}/${selectedRecipe.id}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(object) {
            const container = document.getElementById('container')
            container.innerHTML = ''
            renderRecipeCard(object)
            renderFooter(recipeArray)
            })
}

function renderRecipeCard(recipe) {
    const container = document.getElementById('container')
    const newDiv = document.createElement('div')
    newDiv.className = 'card'
    newDiv.id = 'matching-recipe'
    let title = document.createElement("h1")
    title.innerText = `${recipe.name}`
    let rating = document.createElement("h2")
    rating.className = "rating"
    rating.innerText = renderRatings(recipe.ratings)
    let time = document.createElement("h2")
    time.innerText = recipeTime(recipe.time)
    let ingredients = document.createElement("ul")
    let ingredientsArray = recipe.ingredients.split("; ")
    for (const i of ingredientsArray) {
        let li = document.createElement("li")
        li.innerText = i
        ingredients.appendChild(li)
    }
    let steps = document.createElement("p")
    steps.innerText = recipe.steps
    let ratingFeature = addRatingFeature(recipe)

    newDiv.appendChild(title)
    newDiv.appendChild(rating)
    newDiv.appendChild(time)
    newDiv.appendChild(ingredients)
    newDiv.appendChild(steps)
    newDiv.appendChild(ratingFeature)
    container.appendChild(newDiv)

}

function recipeTime(minutes) {
    if (minutes < 60) {
        return `${minutes} minutes`
    }
    else if (minutes % 60 === 0) {
        return `${minutes/60} hours`
    }
    else {
        let rawQuotient = minutes/60
        let remainder = rawQuotient % 1;
        if (remainder < 1 && remainder > 0.5) {
            return `${rawQuotient - remainder + 1} hours`
        }
        else {
            return `${rawQuotient - remainder} 1/2 hours`
        }
    }
}

function renderFooter(recipeArray) {
    const container = document.getElementById('container')
    const footer = document.getElementById('results')
    let prompt = document.createElement("h3")
    prompt.innerText = `Don't like this recipe?`
    let btn1 = document.createElement("button")
    btn1.innerText = `See Other Matches`
    btn1.addEventListener("click", function (){
        if (prompt) {
        prompt.remove();
        }
        container.innerHTML = ''
        renderMiniCards(recipeArray)
    })
    let btn2 = document.createElement("button")
    btn2.innerText = `See All Recipes`
    btn2.addEventListener("click", function (){
        if (prompt) {
            prompt.remove();
        }
        container.innerHTML = ''
        renderMiniCards(Recipe.all)
    })
    let btn3 = document.createElement("button")
    btn3.innerText = `Start Over`
    btn3.addEventListener("click", function (){
        location.reload();
    })
    footer.appendChild(prompt)
    footer.appendChild(btn1)
    footer.appendChild(btn2)
    footer.appendChild(btn3)
}



function renderMiniCards(array) {
    const container = document.getElementById('container')
    for (const recipe of array) {
    const newDiv = document.createElement('div')
    newDiv.className = 'mini-card'
    let title = document.createElement("h1")
    title.innerText = `${recipe.name}`
    title.addEventListener("click", function(){
        container.innerHTML = ''
        fetch(`${RECIPES_URL}/${recipe.id}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(object) {
            renderRecipeCard(object)
        })
    })
    let rating = document.createElement("h2")
    rating.className = "rating"
    rating.innerText = renderRatings(recipe.ratings)
    let time = document.createElement("h2")
    time.innerText = recipeTime(recipe.time)
    newDiv.appendChild(title)
    newDiv.appendChild(rating)
    newDiv.appendChild(time)
    container.appendChild(newDiv)
    }
}

function renderRatings(ratingsArray) {
    let avgRating = ratingsArray.reduce((a, b) => (a + b)) / ratingsArray.length;
    if (avgRating >= 0 && avgRating < 1) {
        return `☆☆☆☆☆`
        }
    else if (avgRating >= 1 && avgRating < 2) {
        return `★☆☆☆☆`
        }
    else if (avgRating >= 2 && avgRating < 3) {
        return `★★☆☆☆`
        }
    else if (avgRating >= 3 && avgRating < 4) {
        return `★★★☆☆`
        }
    else if (avgRating >= 3 && avgRating < 4) {
        return `★★★★☆`
        }
    else {
        return `★★★★★`
    }

}

function addRatingFeature (recipe) {

    let stars = document.createElement("p")
    stars.innerText = `Rate this recipe: `
    stars.id = "rating"
    let star1 = document.createElement("p")
    star1.innerText = `☆`
    star1.addEventListener("hover", changeStarColor([star1])
    star1.addEventListener("click", addRating(recipe, 1))
    let star2 = document.createElement("p")
    star2.innerText = `☆`
    star2.addEventListener("hover", changeStarColor([star1, star2])
    star2.addEventListener("click", addRating(recipe, 2))
    let star3 = document.createElement("p")
    star3.innerText = `☆`
    star3.addEventListener("hover", changeStarColor([star1, star2, star3])
    star3.addEventListener("click", addRating(recipe, 3))
    let star4 = document.createElement("p")
    star4.innerText = `☆`
    star4.addEventListener("hover", changeStarColor([star1, star2, star3, star4])
    star4.addEventListener("click", addRating(recipe, 4))
    let star5 = document.createElement("p")
    star5.innerText = `☆`
    star5.addEventListener("hover", changeStarColor([star1, star2, star3, star4, star5])
    star5.addEventListener("click", addRating(recipe, 5))

    stars.appendChild(star1)
    stars.appendChild(star2)
    stars.appendChild(star3)
    stars.appendChild(star4)
    stars.appendChild(star5)

    return stars

}

function changeStarColor(starArray) {
    for (const star of starArray) {
        star.innerText = `★`
    }
}

function addRating(recipe, number) {
    let stars = document.getElementById("rating")
    stars.className = "clicked"
    let ratingData = {
        "value": number,
        "recipe_id": recipe.id,
        };
        let configObj = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify(ratingData)
          };
          fetch(RATINGS_URL, configObj)
          .then(function(response) {
              return response.json();
          })
          .then(function(object) {
              
          });



}