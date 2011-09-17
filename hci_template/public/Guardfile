# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard 'livereload', :apply_js_live => false do
  watch(%r{app/.+\.(erb|haml)})
  watch(%r{app/helpers/.+\.rb})
  watch(%r{public/.+\.(css|js|html)})
  watch(%r{config/locales/.+\.yml})
end

guard 'shell' do
  # builds latex file to pdf and hides output
  watch('config/init_values/.+') do |m|
    `rake js:init_values`
  end
end

