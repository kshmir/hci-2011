namespace :populate do
  # Ideas: add categories!

  task :products => :environment do
    require 'populator'
    require 'faker'

    [Product, Category].each(&:delete_all)
    Category.populate 20 do |category|
      category.name = Populator.words(1..3).titleize
      Product.populate 10..100 do |product|
        product.name = Populator.words(1..5).titleize
        product.description = Populator.sentences(1..2)
        product.price = 5..100
        product.created_at = 2.years.ago..Time.now
      end
      category.parent_id = 1..20
    end

  end
end