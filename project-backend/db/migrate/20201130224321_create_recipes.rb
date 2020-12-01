class CreateRecipes < ActiveRecord::Migration[6.0]
  def change
    create_table :recipes do |t|
      t.string :name
      t.string :type
      t.string :ingredients
      t.integer :time
      t.string :steps
      t.string :skill_level

      t.timestamps
    end
  end
end
