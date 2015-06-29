Rails.application.routes.draw do
  get 'welcome/index' => 'welcome#index'

  put 'game/player_x/:name' => 'game#new_game'

  put  'game/:id/player_o/:name' => 'game#add_second_player'

  post 'game/:id/player_o/:name/cell/:cell' => 'game#player_o_move'
  post 'game/:id/player_x/:name/cell/:cell' => 'game#player_x_move'

  get  'game/:id/turn' => 'game#get_turn'
  get  'game/:id' => 'game#get_board'

  root 'welcome#index'  
end
