class HomeController < ApplicationController
  def index 
    @top_products = Product.limit(6)
  end
end
