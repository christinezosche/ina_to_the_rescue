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
    
    get avgRating() {
       let ratingsArray = this.ratings.map(rating => rating.value)
                if (ratingsArray.length === 0) {
                return 0
                }
                else {
                return ratingsArray.reduce((a, b) => (a + b)) / ratingsArray.length;
                }
      }

    static filterByCourse = (search) => 
        this.all.filter(recipe => recipe.course.includes(search))
    
    static filterByCourseAndIngredients (course, ingredients) {
        let filteredByCourse = Recipe.filterByCourse(course)
        let filteredByCourseAndIngredients = filteredByCourse.filter(recipe =>
            ingredients.some(i => recipe.ingredients.toLowerCase().includes(i))) 
        for (const recipe of filteredByCourseAndIngredients) {
            recipe.ingredientsCount = 0
           for (const i of ingredients) {
               if (recipe.ingredients.includes(i)){ 
                    recipe.ingredientsCount++
                }           
            }
        }
        return filteredByCourseAndIngredients.sort((a, b) => b.ingredientsCount - a.ingredientsCount)
    }

    static filterByCourseIngredientsAndTime (course, ingredients, time) {
        let filteredByCourseAndIngredients = Recipe.filterByCourseAndIngredients (course, ingredients)
        if (time === 0) {
            return filteredByCourseAndIngredients
        }
        else {
        return filteredByCourseAndIngredients.filter(recipe => recipe.time <= time)
        }
    }

    static sortAllByRatingAndCourse (course) { 
        let filteredByCourse = Recipe.filterByCourse(course)
        return filteredByCourse.sort((a, b) => b.avgRating - a.avgRating)
    }
  }

const RECIPES_URL = `http://localhost:3000/recipes`
const RATINGS_URL = `http://localhost:3000/ratings`
const container = document.getElementById('container')
const footer = document.getElementById('footer')

document.addEventListener('DOMContentLoaded', () => {
    fetch(RECIPES_URL)
    .then((response) => response.json())
    .then((array) => {
        for (const recipe of array) {
           new Recipe(recipe.id, recipe.name, recipe.ingredients, recipe.time, recipe.course, recipe.ratings)
          }
        })

    renderPrompt()
})

function renderPrompt () {
    let newDiv = document.createElement('div')
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
    const courseList = document.getElementById('course-list')
    const filteredRecipes = Recipe.filterByCourse(courseList.value)
    courseList.removeEventListener("change", findRecipesByCourse)
    courseList.disabled = true;

    const question = document.getElementById('course-question')
    question.className = "selected"
    
        appendIngredientsQuestion()
    
        renderPossibleMatches(filteredRecipes)
}

function appendIngredientsQuestion() {
    const div = document.getElementById('question-list')
        let question = document.createElement('p')
        question.id = "ingredients-question"
        question.innerHTML = `What ingredients do you have? `
        let input = document.createElement("input");
            input.placeholder = "Lemons, flour, eggs"
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
    const ingredientsButton = document.getElementById('ingredients-button')
    const ingredientsText = document.querySelector('input[name="ingredients"]')
    const question = document.getElementById('ingredients-question')
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
            const courseList = document.getElementById('course-list')
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
                renderPossibleMatches(filteredRecipes)
                }
            }
    }
}

function appendTimeQuestion () {
    const div = document.getElementById('question-list')
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
    const courseList = document.getElementById('course-list')
    const timeList = document.getElementById('time-list')
    const ingredientsText = document.querySelector('input[name="ingredients"]')
    const ingredients = sanitizeAndSplit(ingredientsText.value)
    const filteredRecipes = Recipe.filterByCourseIngredientsAndTime(courseList.value, ingredients, parseInt(timeList.value))
    const question = document.getElementById('time-question')
    
    if (question.childNodes[2]) {
        removeAlert(question, 2); }

    if (filteredRecipes.length === 0) {
        let alert = document.createElement("p")
        alert.className = "alert"
        alert.innerText = `No recipes found. Choose another time. `
        let btn = document.createElement("button")
        btn.innerText = "Skip this step"
        btn.addEventListener("click", () => {
        removeAlert(question, 2);
        footer.innerHTML = ''
        fetchMatchingRecipe(Recipe.filterByCourseAndIngredients(courseList.value, ingredients))
        })
        alert.appendChild(btn)
        question.appendChild(alert)
        }

    else {
        footer.innerHTML = ''
        fetchMatchingRecipe(filteredRecipes)
    }
}

function fetchMatchingRecipe(recipeArray) {
    let timeList = document.getElementById('time-list')
    timeList.removeEventListener("change", findRecipesByTime)
    timeList.disabled = true;
    let question = document.getElementById('time-question')
    question.className = "selected"

    let selectedRecipe = recipeArray[0]

    fetch(`${RECIPES_URL}/${selectedRecipe.id}`)
        .then((response) => response.json())
        .then((object) => {
            container.innerHTML = ''
            renderRecipeCard(object)
            renderFooter(recipeArray, selectedRecipe.course)
            })
}

function renderRecipeCard(recipe) {
    let newDiv = document.createElement('div')
    newDiv.className = 'card'
    newDiv.id = 'matching-recipe'
    let title = document.createElement("h1")
    title.innerText = `${recipe.name}`
    let rating = document.createElement("h2")
    rating.id = recipe.id
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
    let ratingLine = document.createElement("h3")
    ratingLine.innerText = 'Rate this recipe'
    let ratingFeature = document.createElement("h3")
    ratingFeature.id = 'rating-feature'
    ratingLine.appendChild(ratingFeature)

    newDiv.appendChild(title)
    newDiv.appendChild(rating)
    newDiv.appendChild(time)
    newDiv.appendChild(ingredients)
    newDiv.appendChild(steps)
    newDiv.appendChild(ratingLine)
    container.appendChild(newDiv)
    renderRatings(recipe)
    addRatingFeature(recipe)
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

function renderFooter(recipeArray, course) {
    let prompt = document.createElement("h3")
    prompt.innerText = `Don't like this recipe?`
    let btn1 = document.createElement("button")
    btn1.innerText = `See Other Matches`
    btn1.addEventListener("click", () => {
        if (prompt) {
        prompt.remove();
        }
        container.innerHTML = ''
        renderMiniCards(recipeArray)
    })
    let btn2 = document.createElement("button")
    btn2.innerText = `See All ${course.charAt(0).toUpperCase() + course.slice(1)}s`
    btn2.addEventListener("click", () => {
        if (prompt) {
            prompt.remove();
        }
        container.innerHTML = ''
        renderMiniCards(Recipe.sortAllByRatingAndCourse(course))
    })
    let btn3 = document.createElement("button")
    btn3.innerText = `Start Over`
    btn3.addEventListener("click", () => location.reload())
    
    for (const element of [prompt, btn1, btn2, btn3]) {
    footer.appendChild(element)
    }
}

function renderMiniCards(array) {
    for (const recipe of array) {
    const newDiv = document.createElement('div')
    newDiv.className = 'mini-card'
    let title = document.createElement("h1")
    title.innerText = `${recipe.name}`
    title.addEventListener("click", () => {
        container.innerHTML = ''
        fetch(`${RECIPES_URL}/${recipe.id}`)
        .then((response) => response.json())
        .then((object) => renderRecipeCard(object))
    })
    let rating = document.createElement("h2")
    rating.id = recipe.id
    let time = document.createElement("h2")
    time.innerText = recipeTime(recipe.time)
    for (const element of [title, rating, time]) {
        newDiv.appendChild(element)
        }
    container.appendChild(newDiv)
    renderRatings(recipe)
    }
}

function renderRatings(recipe) {
    const ratingContainer = document.getElementById(recipe.id)
    fetch(`${RECIPES_URL}/${recipe.id}`)
        .then((response) => response.json())
        .then((object) => {
            let array = object.ratings
            let ratingsArray = array.map(rating => rating.value)
        if (ratingsArray.length === 0) {
            ratingContainer.innerHTML = `☆☆☆☆☆`
        }
        else {
        let avg = ratingsArray.reduce((a, b) => (a + b)) / ratingsArray.length;
        ratingContainer.innerHTML = renderStars(avg)
    }   
    })
}

function renderStars(value) {
    if (value >= 0 && value < 1) {
        return `☆☆☆☆☆`
        }
    else if (value >= 1 && value < 2) {
        return `★☆☆☆☆`
        }
    else if (value >= 2 && value < 3) {
        return `★★☆☆☆`
        }
    else if (value >= 3 && value < 4) {
        return `★★★☆☆`
        }
    else if (value >= 4 && value < 5) {
        return `★★★★☆`
        }
    else {
        return `★★★★★`
    }
}

function addRatingFeature (recipe) {
    let ratingFeature = document.getElementById('rating-feature')
   
    let star1 = document.createElement('button')
    addFunctionsToStar(star1, [star1], recipe)

    let star2 = document.createElement('button')
    addFunctionsToStar(star2, [star1, star2], recipe)

    let star3 = document.createElement('button')
    addFunctionsToStar(star3, [star1, star2, star3], recipe)

    let star4 = document.createElement('button')
    addFunctionsToStar(star4, [star1, star2, star3, star4], recipe)

    let star5 = document.createElement('button')
    addFunctionsToStar(star5, [star1, star2, star3, star4, star5], recipe)

    for (const star of [star1, star2, star3, star4, star5]){
        ratingFeature.appendChild(star)
    }
}

function addFunctionsToStar(star, array, recipe) {
    star.innerText = `☆`
    star.className = "star"
    star.addEventListener("mouseover", () => {
        array.forEach (s => s.innerText = `★`)
    }, false)
    star.addEventListener("mouseout", () => {
        array.forEach (s => s.innerText = `☆`)
    }, false)
    star.addEventListener("click", () => {
        addRating(recipe, array.length)
    }, false)
}

function addRating(recipe, number) {
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
           .then((response) => response.json())
           .then((object) => {
             container.innerHTML = ''
             renderRecipeCard(recipe)
             let ratingFeature = document.getElementById('rating-feature')
             ratingFeature.className = "clicked";
           });
}

function renderAlertButtons (node) {
    const ingredientsButton = document.getElementById('ingredients-button')
    const ingredientsText = document.querySelector('input[name="ingredients"]')
    const question = document.getElementById('ingredients-question')

    let btn1 = document.createElement("button")
    btn1.id = "try-again-button"
    btn1.innerText = "Try again"
    let btn2 = document.createElement("button")
    btn2.innerText = "Skip this step, I'll shop"
    btn2.id = "shop-button"
    btn1.addEventListener("click", () => {
        ingredientsText.value = ''
        removeAlert(question, 3);
    })

    btn2.addEventListener("click", () => {
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

function renderRecipeName(recipe) {
    let item = document.createElement('p')
    item.innerHTML = recipe.name
    footer.appendChild(item)
}

function renderPossibleMatches(array) {
    footer.innerHTML = ''
    for (const recipe of array) {
        renderRecipeName(recipe)
        }
}

function sanitizeAndSplit (string) {
    let n = string.toLowerCase().replace(/[^A-Za-z0-9-' ]+/g, '')
    let newString = n.replace(/[  ]+/g, ' ')
    return newString.split(" ")
}