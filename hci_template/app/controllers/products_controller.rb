class ProductsController < ApplicationController
  def index
    @top_products = Product.limit(params[:limit] || 45)
    if params[:category]
      @top_products = @top_products.where(:category_id => params[:category])
    end
    respond_to do |f|
      f.html
      f.json {
        render :json => @top_products
      }
      f.xml {
        render :xml => @top_products
      }
    end
  end
  
  def show
    @product = Product.find(params[:id])
    @top_products = Product.order("RANDOM()").limit(9)
    respond_to do |f|
      f.html
      f.json {
        render :json => @product
      }
      f.xml {
        render :xml => @product
      }
    end
  end
end
