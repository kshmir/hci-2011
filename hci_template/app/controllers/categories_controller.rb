class CategoriesController < ApplicationController
  def index
    @category = Category.where(:parent_id => nil)

    respond_to do |f|
      f.json {
        render :text => @category.to_json(:include => :subcategories)
      }
      f.xml {
        render :text => @category.to_xml(:include => :subcategories)
      }
    end
  end

  def show
    @category = Category.find(params[:id])
    respond_to do |f|
      f.json {
        render :json => @category
      }
      f.xml {
        render :xml => @category
      }
    end
  end
end
