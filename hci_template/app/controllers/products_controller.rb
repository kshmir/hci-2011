class ProductsController < ApplicationController
  
  def index 
    @top_products = Product.limit(45)
  end
  
  def show
    @product = Product.find(params[:id])
    @top_products = Product.order("RANDOM()").limit(9)
  end
end
