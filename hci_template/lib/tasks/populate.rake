namespace :populate do
  # Ideas: add categories!
  
  task :products => :environment do
    require 'populator'
    require 'faker'
    
    [Product].each(&:delete_all)

       Product.populate 10..100 do |product|
         product.name = Populator.words(1..5).titleize
         product.description = Populator.sentences(1..2)
         product.price = 5..100
         product.created_at = 2.years.ago..Time.now
       end
  end
end