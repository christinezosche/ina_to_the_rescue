class RemoveSkillLevelFromRecipes < ActiveRecord::Migration[6.0]
  def change
    remove_column :recipes, :skill_level
  end
end
