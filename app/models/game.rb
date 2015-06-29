class Game < ActiveRecord::Base
  def is_won?
    return true if self.cell1 == self.cell2 && self.cell2 == self.cell3 && cell1 != nil
    return true if self.cell4 == self.cell4 && self.cell4 == self.cell6 && cell4 != nil
    return true if self.cell7 == self.cell8 && self.cell8 == self.cell9 && cell7 != nil

    return true if self.cell1 == self.cell4 && self.cell4 == self.cell7 && cell1 != nil
    return true if self.cell2 == self.cell5 && self.cell5 == self.cell8 && cell2 != nil
    return true if self.cell3 == self.cell6 && self.cell6 == self.cell9 && cell3 != nil

    return true if self.cell1 == self.cell5 && self.cell5 == self.cell9 && cell1 != nil
    return true if self.cell3 == self.cell5 && self.cell5 == self.cell7 && cell3 != nil

    return false
  end

  def is_it_a_tie?
    return true if self.winner == nil && self.cell1 != nil && self.cell2 != nil && self.cell3 != nil && self.cell4 != nil && self.cell5 != nil && self.cell6 != nil && self.cell7 != nil && self.cell8 != nil && self.cell9 != nil
  end
end