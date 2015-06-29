class GameController < ApplicationController

  def new_game
    game = Game.new(:player_x => params[:name]) 
    game.turn = game.player_x
    if (game.save)
      render json: {:status => 'success', :result => game.id}
    else
      render json: {:status => 'error', :message => game.errors.full_messages}
    end
  end

  def add_second_player
    game = Game.find(params[:id])
    if (game.player_o != nil)
      render json: {:status => 'success', :result => game.id}
      return
    end
    game.player_o = params[:name]
    if (game.save)
      render json: {:status => 'success', :result => game.id}
    else
      render json: {:status => 'error', :message => game.errors.full_messages}
    end
  end

  def player_x_move
    game = Game.find(params[:id])
    if (game.winner || game.is_tie_game)
      render json: {:status => 'error', :message => "Game finished, no more moves allowed"}
      return
    end

    if game.turn != params[:name] && game.turn != nil
      render json: {:status => 'error', :message => "Not your turn yet"}
      return
    end

    game.send("#{params[:cell]}=","x")
   
    if (game.is_won?)
      game.winner = params[:name]
    end

    if (game.is_it_a_tie?)
      game.is_tie_game = true
    end
    game.turn = game.player_o
    game.save

    render json: {:status => 'success', :result => game}
  end

   def player_o_move
    game = Game.find(params[:id])
    if (game.winner || game.is_tie_game)
      render json: {:status => 'error', :message => "Game finished, no more moves allowed"}
      return
    end

    if game.turn != params[:name] && game.turn != nil
      render json: {:status => 'error', :message => "Not your turn yet"}
      return
    end

    game.send("#{params[:cell]}=","o")
   
    if (game.is_won?)
      game.winner = params[:name]
    end

    if (game.is_it_a_tie?)
      game.is_tie_game = true
    end
    game.turn = game.player_x
    game.save

    render json: {:status => 'success', :result => game}
  end

  def get_board
     game = Game.find(params[:id])
     render json: {:status => 'success', :result => game}
  end
end
