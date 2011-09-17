HciTemplate::Application.routes.draw do

  resources :categories

  match "/products/by/category/:category_name", :to => "products#index"
  resources :products
  
  match "/registration", :to => "user#registration"
  match "/login", :to => "user#login"
  root :to => "home#index"
end
