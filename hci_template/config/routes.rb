HciTemplate::Application.routes.draw do
  resources :products
  
  match "/registration", :to => "user#registration"
  match "/login", :to => "user#login"
  root :to => "home#index"
end
