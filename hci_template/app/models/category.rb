class Category < ActiveRecord::Base
  has_many :products
  has_many :subcategories, :foreign_key => "parent_id", :class_name => "Category"

  belongs_to :parent_category, :foreign_key => "parent_id", :class_name => "Category"

  def all_products
    cats = self.subcategories
    cats.push self
    Product.where("category_id IN (?)", cats)
  end
end