class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :player_x
      t.string :player_o
      t.string :winner
      t.string :turn
      t.string :cell1
      t.string :cell2
      t.string :cell3
      t.string :cell4
      t.string :cell5
      t.string :cell6
      t.string :cell7
      t.string :cell8
      t.string :cell9
      t.boolean :is_tie_game

      t.timestamps
    end
  end
end
