class ChangeColumnNameFromTypeToCourse < ActiveRecord::Migration[6.0]
  def change
    remove_column :recipes, :type, :string
    add_column :recipes, :course, :string
    end
end
