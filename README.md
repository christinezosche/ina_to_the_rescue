# Ina to the Rescue

This app allows users to find an Ina Garten recipe based on the course they are looking to make (starter, main, side or dessert), the ingredients they have on hand, and the time they have to cook. When these critera are entered, the top-matching recipe is displayed. Users also have the option to view additional matches and all recipes for the course they selected (i.e., see all desserts). They can also rate recipes.

## Installation and Usage

Fork and clone this repo. Cd into "project-backend". Run `bundle install` to install required gems. Run `rails db:migrate` to migrate tables, then run `rails db:seed` to seed the recipes. Run `rails s`.

Then, cd into the main directory (cd ..), then cd into "project-frontend". Run "open index.html" to open the app in your browser. 

## Development

In the "project-backend" folder, run `rails c` to experiment with the code for the API.

In the browser, with the app running, right-click the page and select "Inspect", "Inspect Element", etc. to experiment with the JavaScript code in the browser console.

## Contributing
Bug reports and pull requests are welcome on [GitHub](https://github.com/christinezosche/javascript_project). 
    
This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the Contributor Covenant code of conduct.

## License
This code is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).