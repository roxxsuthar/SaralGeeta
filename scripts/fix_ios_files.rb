require 'xcodeproj'

project_path = 'ios/SaralGita.xcodeproj'
project = Xcodeproj::Project.open(project_path)

target_name = 'SaralGita'
target = project.targets.find { |t| t.name == target_name }

if target
  group_name = 'SaralGita'
  # Find the group, but don't create if missing (it should exist)
  group = project.main_group.find_subpath(group_name) 
  
  if group
    files_to_fix = ['OrientationModule.swift', 'OrientationModule.m']
    
    files_to_fix.each do |file_name|
      # 1. Remove ANY existing references to this file to clean up bad paths
      # Search in the whole project (recursively in main group) just to be safe
      refs = project.main_group.recursive_children.select { |c| c.name == file_name || c.path == file_name }
      refs.each do |ref|
        ref.remove_from_project
        puts "Removed old reference: #{ref.path}"
      end

      # 2. Add with the CORRECT relative path
      # The file is physically at ios/SaralGita/filename
      # The project is at ios/SaralGita.xcodeproj
      # So relative path from project root (ios/) is "SaralGita/filename"
      
      real_path = File.join(group_name, file_name) # "SaralGita/OrientationModule.swift"
      
      # Add reference to the group
      # new_reference accepts the path relative to the group's path if set, or project if not.
      # To be safe, we use the specific path.
      file_ref = group.new_reference(file_name) 
      
      # MANUALLY set the path to ensure it points to the subdirectory
      file_ref.path = file_name
      file_ref.source_tree = '<group>'
      
      # Add to target
      target.add_file_references([file_ref])
      puts "Fixed reference for #{file_name}"
    end
    
    project.save
    puts "Project file fixed and saved."
  else
    puts "Group #{group_name} not found!"
  end
else
  puts "Target #{target_name} not found."
end
