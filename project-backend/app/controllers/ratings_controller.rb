class RatingsController < ApplicationController

    def index
        ratings = Rating.all
        render json: ratings, only: [:id, :value, :recipe_id]

    end

    def show
        rating = Rating.find(params[:id])
        render json: rating
    end

    def new

    end

    def create
        rating = Rating.create(value: params[:value], recipe_id: params[:recipe_id])
        render json: rating
    end


end
