Rails.application.routes.draw do
  resources :recipes, only: [:index, :show, :edit, :update]
  resources :ratings, only: [:new, :create]
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
