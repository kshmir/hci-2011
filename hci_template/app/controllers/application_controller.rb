class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :check_started
  
  def check_started
    if session['user_cart'].nil?
      session['user_buys'] = {}      
    end
  end
end
