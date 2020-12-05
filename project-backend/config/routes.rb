Rails.application.routes.draw do
  resources :recipes, only: [:index, :show,]
  resources :ratings, only: [:index, :show, :new, :create]
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
