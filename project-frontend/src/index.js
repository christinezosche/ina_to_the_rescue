document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('container')
    const newDiv = document.createElement('div')
    newDiv.className = 'card'
    let question = document.createElement('p')
    question.innerHTML = `What course are you making? `
    let input = document.createElement("input");
        input.type = "text"
        input.name = "course"
    question.appendChild(input)
    newDiv.appendChild(question)
    container.append(newDiv)
})