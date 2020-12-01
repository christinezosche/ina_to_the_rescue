class RecipesController < ApplicationController

    def index
        recipes = Recipe.all
        render json: recipes, only: [:id, :name, :course, :time, :skill_level, :ingredients, :steps], :include => {
            :ratings => {:only => [:value]}
    }
    end

    def show
        recipe = Recipe.find(params[:id])
        render json: recipe, only: [:id, :name, :course, :time, :skill_level, :ingredients, :steps], :include => {
            :ratings => {:only => [:value]}
    }
    end

    def edit

    end

    def update

    end

end
