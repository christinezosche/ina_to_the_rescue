class RecipesController < ApplicationController

    def index
        recipes = Recipe.all
        render json: recipes, only: [:id, :name, :course, :time, :ingredients, :steps, :skill_level, ], :include => {
            :ratings => {:only => [:value]}
    }
    end

    def show
        recipe = Recipe.find(params[:id])
        render json: recipe, only: [:id, :name, :course, :time, :ingredients, :steps, :skill_level, ], :include => {
            :ratings => {:only => [:value]}
    }
    end

    def edit

    end

    def update

    end

end
